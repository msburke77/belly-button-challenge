function generateCharts(sample){
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        let samples = data.samples;
        let resultsArray = samples.filter((sampleDictionary) => sampleDictionary.id == sample);
        let result = resultsArray[0];

        let sampleValues = result.sample_values;
        let otuIDs = result.otu_ids;
        let otuLabels = result.otu_labels;

        // Create bar chart
        let yticks = otuIDs.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        let barData = [
            {
            x: sampleValues.slice(0,10).reverse(),
            y: yticks,
            text: otuLabels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
            }
        ]
        
        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 40, l: 150}
        }

        // Generate bar chart
        Plotly.newPlot("bar", barData, barLayout);
        
        // Create bubble chart
        let bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: {t: 0},
        hovermode: "closest",
        xaxis: {title: "Operational Taxonomic Unit (OTU) ID"},
        margin: {t: 40}
        };
            
        let bubbleData = [
            {
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
            size: sampleValues,
            color: otuIDs,
            colorscale: "icefire"        
            }
            }
        ]

        // Generate bubble chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// Create metadata function
function generateMetadata(sample){
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        let metadata = data.metadata;
        let resultsArray = metadata.filter(sampleDictionary => sampleDictionary.id == sample);
        let result = resultsArray[0];
        let PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        for(key in result) {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`)
        }

// BONUS – create gauge chart
function generateGauge(wfreq){
    let level = parseFloat(wfreq) * 20;
    let degrees = 180 - level;
    let radius = 0.5;
    let radians = (degrees * Math.PI) / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);
    let mainPath = "M-.0 -0.05 L .0 0.05 L";
    let pathX = String(x);
    let space = " ";
    let pathY = String(y);
    let pathEnd = " Z";
    let path = mainPath.concat(pathX, space, pathY, pathEnd);

    let data = [
        {
            type: "scatter",
            x: [0],
            y: [0],
            marker: {size: 12, color: "339339"},
            showlegend: false,
            name: "Freq",
            text: level,
            hoverinfo: "text+name"
        },

        {   values:[50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            rotation: 90,
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                    "rgba(0, 105, 11, .5)",
                    "rgba(10, 120, 22, .5)",
                    "rgba(14, 127, 0, .5)",
                    "rgba(110, 154, 22, .5)",
                    "rgba(70, 202, 42, .5)",
                    "rgba(202, 209, 95, .5)",
                    "rgba(210, 205, 145, .5)",
                    "rgba(232, 226, 202, .5)",
                    "rgba(240, 230, 215, .5)",
                    "rgba(255, 255, 255, .5)",
                ]
            },
            labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
        }
    ]
    let layout = {
        shapes: [
            {
                type: "path",
                path:path,
                fillcolor: "339339",
                line: {
                    color: "339339"
                }
            }
        ],
        title: "<b>Belly Button Washing Frequency</b><br /># Scrubs per Week",
        height: 500,
        width: 500,
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1,1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1,1]
        }
    }
        let GAUGE = document.getElementById("gauge");

        // Generate gauge chart
        Plotly.newPlot(GAUGE, data, layout);
}
        generateGauge(result.wfreq);
    })

}

// Initializion
function init(){
    let selector = d3.select("#selDataset");

    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) =>{
        let sampleNames = data.names;
        // Check the entry that the user made with to the list of subject IDs in the list with a for loop
        for(let index = 0; index < sampleNames.length; index++){
            selector.append("option").text(sampleNames[index]).property("value", sampleNames[index]);
            
        }
        //set first sample to zero, then generate charts and metadata based on zero value
        let sampleOne = sampleNames[0];
        generateCharts(sampleOne);
        generateMetadata(sampleOne);
    })
}

// Subject number changes based on the user entry, run the option change and pull associated data with new entry
function optionChanged(nextSample){
    generateCharts(nextSample);
    generateMetadata(nextSample);
}

init();