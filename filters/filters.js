var filters = (function(powerbi) {
  let filters = [
    {
      "$schema": "http://powerbi.com/product/schema#basic",
      "target": {
        "table": "School",
        "column": "DistrictCode"
      },
      "filterType": 1,
      "displaySettings": { "isHiddenInViewMode": true },
      "operator": "All",
      "values": [ "63280" ],
      "requireSingleSelection": false
    }
  ];

  /**
   * This is the attempt where I embed the report with a set of filters
   * to apply initially. I should be able to do this and then, right after
   * the report finishes loading, go in and see my filters changed.
   */
  function tryEmbedUsingInitialFilters() {
    let report = embedding.embed(filters);

    report.on("loaded", function() {
      report.getFilters().then(function(filtersAfterEmbed) {
        console.log("I should be able to see the filter I set with the value I set (DistrictCode of 63280)")
        console.log(filtersAfterEmbed);
      });
    });
  }

  /**
   * This is the attempt where I embed the report without filters initially.
   * Later, after the report embed loads, I go in and set the filters using
   * the 'report.setFilters' method. Once I call setFilter, I should be able
   * to see the filters changed.
   */
  function tryEmbedUsingSetFiltersMethod() {
    let report = embedding.embed(undefined);

    report.on("loaded", async function() {
      report.setFilters(filters).then(function() {
        report.getFilters(function(filtersAfterEmbed) {
          console.log("I should be able to see the filter I set with the value I set (DistrictCode of 63280)")
        console.log(filtersAfterEmbed);
        })
      })
    });
  }

  return {
    tryEmbedUsingInitialFilters: tryEmbedUsingInitialFilters,
    tryEmbedUsingSetFiltersMethod: tryEmbedUsingSetFiltersMethod
  };

})(window.powerbi)