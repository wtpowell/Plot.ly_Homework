//grab demographic data
function demoInfo(id){
    d3.json("samples.json").then((data)=> {
        var metadata = data.metadata;
        console.log(metadata);

        //filter by id
        var filterResult = metadata.filter(info => info.id.toString() === id)[0];

        var panelBody = d3.select("#sample-metadata");

      
        panelBody.html("");

        Object.entries(filterResult).forEach((key)=>{
            panelBody.append("p").text(key[0] + ":" + key[1]);
        });
    });
};

//plot functions
function plots(id) {
    d3.json("samples.json").then((data)=> {
        
        
        //filter wfreq by id
        var wfreq = data.metadata.filter(f => f.id.toString() === id)[0];
        wfreq = wfreq.wfreq;
        console.log("Washing Freq: " + wfreq);
        
        // filter samples by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log("Samples: " + samples);
  
        // grab the top 10  
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        console.log("top 10 samples: " + samplevalues);
  
        // grab the top ten otu's and then reverse the list so that it appears in proper order. 
        var OTU = (samples.otu_ids.slice(0, 10)).reverse();
        
        // formate otu
        var OTU_id = OTU.map(d => "otu " + d)
  
        console.log("otu_id: " + OTU_id);
  
  
        // grab top ten labels and then reverse for proper formating.
        var labels = samples.otu_labels.slice(0, 10).reverse();
        console.log("labels: " + labels);
  
        // plot set up. 
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'Blue'},
            type:"bar",
            orientation: "h",
        };
  
        var data = [trace];
  
        // create bar plot
        Plotly.newPlot("bar", data);
      
        // The bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // set up bubble plot
        var layout_b = {
            xaxis:{title: "otu_id"},
            height: 600,
            width: 1200
        };
   
        var data1 = [trace1];
  
        // create bubble plot
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // create gauge chart
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: {text: `Belly Button Washing Frequency`},
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    {range: [0, 1], color: "white"},
                    {range: [1, 2], color: "white"},
                    {range: [2, 3], color: "white"},
                    {range: [3, 4], color: "white"},
                    {range: [4, 5], color: "white"},
                    {range: [5, 6], color: "white"},
                    {range: [6, 7], color: "white"},
                    {range: [7, 8], color: "white"},
                    {range: [8, 9], color: "white"}
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  

function init() {
    d3.json("samples.json").then((data)=> {
        console.log(data);

        //grab the name for drop down menu
        data.names.forEach((name) => {
            d3.select("#selDataset")
            .append("option")
            .text(name)
            .property("value");
        });
        plots(data.names[0]);
        demoInfo(data.names[0]);
    });
};
init();

function optionChanged(id){
    plots(id);
    demoInfo(id);
};