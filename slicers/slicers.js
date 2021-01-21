var slicers = (function(powerbi) {
  
  function setupEmbed() {
    let report = embedding.embed(undefined);

    report.on("dataSelected", function() {
      console.log("I expect to hit this line when any slicer is changed.");
    });
  }

  return {
    setupEmbed: setupEmbed
  };

})(window.powerbi)