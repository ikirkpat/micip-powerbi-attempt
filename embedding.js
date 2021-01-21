var embedding = (function(powerbi) {
  let embedUrl = "https://app.powerbigov.us/reportEmbed?reportId=b8735bda-e087-483c-b534-d7015e22d33d&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLUdPVi1JT1dBLXJlZGlyZWN0LmFuYWx5c2lzLnVzZ292Y2xvdWRhcGkubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZX19";
  let reportId = "b8735bda-e087-483c-b534-d7015e22d33d";

  function getAccessToken() {
    let accessTokenInput = document.getElementById("accessToken");
    return accessTokenInput.value;
  }

  function getConfigurations(filters) {
    let accessToken = getAccessToken();
    
    const reportConfig = {
      type: 'report',
      accessToken: accessToken,
      embedUrl: embedUrl,
      id: reportId,
      filters: filters
    };

    return reportConfig;
  }

  function embed(filters) {
    let reportContainer = document.getElementById("reportContainer");
    let reportConfig = getConfigurations(filters)

    let report = powerbi.embed(reportContainer, reportConfig);

    return report
  }

  return {
    /**
     * @param {pbi.models.IFilter[]} filters
     * @returns {pbi.Report} the report that was embedded
     */
    embed: embed
  };

})(window.powerbi);