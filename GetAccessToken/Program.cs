using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using static GetAccessToken.MicrosoftIdentityTokenRetriever;

namespace GetAccessToken
{
  public static class Program
  {
    public static void Main()
    {
      var config = MiDataHubReportsConfiguration.GetDefaultConfiguration();
      var tokenRetriever = new MicrosoftIdentityTokenRetriever(config);
      string accessToken = tokenRetriever.GetAccessToken().Result;
      Console.WriteLine("AccessToken:\n\n" + accessToken);
    }
  }

  /// <summary>
  /// Provides ability to fetch an access token from a Microsoft Identity Provider.
  /// This instances underlying provider is a Microsoft Identity Provider.
  /// </summary>
  public class MicrosoftIdentityTokenRetriever
  {
    private MiDataHubReportsConfiguration configuration;

    public MicrosoftIdentityTokenRetriever(MiDataHubReportsConfiguration configuration)
    {
      this.configuration = configuration;
    }

    /// <inheritdoc/>
    public async Task<string> GetAccessToken()
    {
      AuthenticationResult authenticationResult = null;
      // Create a public client to authorize the app with the AAD app
      IPublicClientApplication clientApp = PublicClientApplicationBuilder.Create(this.configuration.PbiClientId)
                                                                         .WithAuthority(this.configuration.PbiAuthorityUri)
                                                                         .Build();
      var scopes = new string[] { this.configuration.PbiAuthenticationScope };
      IEnumerable<IAccount> userAccounts = await clientApp.GetAccountsAsync();
      try
      {
        // Retrieve Access token from cache if available
        authenticationResult = await clientApp.AcquireTokenSilent(scopes, userAccounts.FirstOrDefault()).ExecuteAsync();
      }
      catch (MsalUiRequiredException)
      {
        SecureString securePassword = new SecureString();
        foreach (char passwordChar in this.configuration.PbiPassword)
        {
          securePassword.AppendChar(passwordChar);
        }
        authenticationResult = await clientApp.AcquireTokenByUsernamePassword(
          scopes,
          this.configuration.PbiUsername,
          securePassword)
          .ExecuteAsync();
      }
      return authenticationResult.AccessToken;
    }

    public class MiDataHubReportsConfiguration
    {
      public string PbiUsername { get; set; } = string.Empty;
      public string PbiPassword { get; set; } = string.Empty;
      public string PbiAuthenticationScope { get; set; } = string.Empty;
      public string PbiClientId { get; set; } = string.Empty;
      public string PbiAuthorityUri { get; set; } = string.Empty;

      public static MiDataHubReportsConfiguration GetDefaultConfiguration()
      {
        return new MiDataHubReportsConfiguration()
        {
          PbiUsername = "SA_MiDatahub-PowerBI@michigan.gov",
          PbiPassword = "SYtrp1G4Z!YbJt6bnKoM5%MPe",
          PbiClientId = "7d3f3c68-21cd-490c-9484-b9b097b0bc23",
          PbiAuthorityUri = "https://login.microsoftonline.com/organizations/",
          PbiAuthenticationScope = "https://analysis.usgovcloudapi.net/powerbi/api/.default"
        };
      }
    }
  }
}