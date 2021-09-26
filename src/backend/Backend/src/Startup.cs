using System;
using backend.src.DataSources;
using backend.src.GraphQL;
using GraphQL.MicrosoftDI;
using GraphQL.Server;
using GraphQL.Types;
using Kadmium_sACN.SacnReceiver;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace backend
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{

			services.AddControllersWithViews();

			services.AddSingleton<IDeviceDataSource, DeviceDataSource>();
			services.AddSingleton<IDmxWriterFactory, EnttecWriterFactory>();
			services.AddSingleton<IMulticastSacnReceiver, MulticastSacnReceiverIPV4>();
			services.AddSingleton<ISchema, EnttecSchema>(services => new EnttecSchema(new SelfActivatingServiceProvider(services)));

			services.AddGraphQL(options =>
				{
					options.EnableMetrics = true;
				})
				.AddErrorInfoProvider(opt => opt.ExposeExceptionStackTrace = true)
				.AddSystemTextJson()
				.AddGraphTypes();

			// In production, the React files will be served from this directory
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "frontend";
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			if (env.IsDevelopment())
			{
				Console.Out.WriteLine("Adding CORS");
				app.UseCors(policy =>
				{
					policy.AllowAnyHeader();
					policy.AllowAnyMethod();
					policy.AllowAnyOrigin();
				});
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();

			app.UseRouting();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller}/{action=Index}/{id?}");
			});

			app.UseGraphQL<ISchema>();

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "frontend";
			});
		}
	}
}
