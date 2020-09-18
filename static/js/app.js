// Belly Button Diversity Plotly Homework
// Written by Jason Gabunilas

// Begin by using the D3 library to read in the data from samples.json
var queryURL = `../../samples.json`

// This function will populate the Test Subject ID No selection menu based on the returned JSON data
var populate_names = function() {
        d3.json(queryURL).then(function(data) {
                // The names is a simple array and can be directly referenced
                var names = data.names
                // For each ID number in names, append an option to the dropdown menu representing that ID
                names.forEach((id) => {
                        d3.select("#selDataset")
                        .append('option')
                        .attr("value", id)
                        .text(id)
                })
        })   
}


// This code block will initialize the dashboard with a barplot and bubble plot of the first test subject, which is the first object in the data.samples array
d3.json(queryURL).then(function(data) {
        populate_names()
        var svals = data.samples[0].sample_values
        var ids_otu = data.samples[0].otu_ids
        // Add the OTU lettering to each OTU ID and return as a new array
        var ids_OTU = ids_otu.map(otu => `OTU ${otu}`)
        // Extract the otu_labels for the hovertext
        var hovertext = data.samples[0].otu_labels
                        // console.log(labels_otu)
        initialize_barplot(ids_OTU, svals, hovertext)
                        // console.log(svals)
                        // console.log(`OTU ${labels}`)
        initialize_bubbleplot(ids_otu, svals, hovertext)
        initialize_demog();
        initialize_gauge();
})





// This function initiates the barplot for the default test subject. Note that the id's and values are sliced to only show the top 10
var initialize_barplot = function(ids, read_value, htext) {
        var trace1 = {
                type: 'bar',
                x: read_value.slice(0, 9),
                y: ids.slice(0, 9),
                text: htext.slice(0, 9),
                orientation: 'h'
        };

        var data = [trace1];

        var layout = {
                title: `Sequencing Read Numbers for Top 10 OTUs`,
                xaxis: {
                        title: 'Sequencing Read Count'
                },
                yaxis: {
                        // Sort the values in ascending order
                        categoryorder: 'total ascending'
                }
        };

        Plotly.newPlot('bar', data, layout)
}

// This function initializes the bubble plot for the default test subject. Here all OTUs are shown, not just the top 10. We also pass in the ID numbers without the OTU labels to make for a more scattered bubble plot.
var initialize_bubbleplot = function(ids, read_value, htext) {
        var trace1 = {
                x: ids,
                y: read_value,
                mode: 'markers',
                marker: {
                        size: read_value,
                        color: ids
                },
                text: htext
        };

        var data = [trace1];

        var layout = {
                title: "Sequencing Reads for All OTU IDs",
                xaxis: {
                        title: "OTU ID"
                },
                yaxis: {
                        title: "Sequencing Read Counts"
                }
        };

        Plotly.newPlot('bubble', data, layout)
}

// This function initializes the demographic information display for the default subject ID (940)
var initialize_demog = function () {
        // First read in the JSON object again
        d3.json(queryURL).then(function(data) {
                // The first object within the metadata array contains a series of metadata properties related to subject id 940. Iterative over each of these properties and obtain their key:value pairs. Each key:value pair is a piece of demographic data
                Object.entries(data.metadata[0]).forEach(function([key, value]) {
                        // For each key:value pair, append a new paragraph HTML element and use the key:value information to assign the text value to that element
                        d3.select('#sample-metadata')
                        .append('p')
                        .text(`${key}: ${value}`)
                })
        })
}

var initialize_gauge = function () {
        d3.json(queryURL).then(function(data) {
                // Determine the number of washes for the default test subject (940), which is the value of the wfreq key within the metadata object for subject 940
                var washes = data.metadata[0].wfreq
                // console.log(washes)
                // Define the data for the gauge chart
                var data = [
                        {
                                domain: { x: [0, 1], y: [0, 1] },
                                value: washes,
                                title: { 
                                        text: "Belly Button Washes Per Week" 
                                },
                                type: "indicator",
                                mode: "gauge+number",
                                gauge: {
                                        // Set to axis to between 0 and 9 washes per week
                                        axis: { 
                                                range: [0, 9] 
                                        },
                                        // Segment the chart colors based on number of washes
                                        steps: [
                                                { range: [0, 1], color: "fa615c" },
                                                { range: [1, 2], color: "e67158" },
                                                { range: [2, 3], color: "d28257" },
                                                { range: [3, 4], color: "be9255" },
                                                { range: [4, 5], color: "aaa353" },
                                                { range: [5, 6], color: "96b350" },
                                                { range: [6, 7], color: "82c44e" },
                                                { range: [7, 8], color: "6ed44c" },
                                                { range: [8, 9], color: "5ae54a" },
                                        ],
                                }
                        }
                      ];
                      
                var layout = { 
                        width: 600, 
                        height: 450, 
                        margin: { t: 0, b: 0 } 
                };
                Plotly.newPlot('gauge', data, layout);
                
        })
}


// Write the optionChanged function, which takes as an argument the value of the #selDataset when a change is detected by the DOM. Using this ID, extract the otu_ids, values, and labels, and pass them into the function updateBarplot()
var optionChanged = function(new_value) {
        d3.json(queryURL).then(function(data) {
                // Iterate over each object (sample) within the samples array.
                data.samples.forEach(sample => {
                        // If the sample id of the current sample is equal to the value of the selection of #selDataset, execute the code to extract the data
                        if (sample.id === new_value) {
                                var svals = sample.sample_values
                                var ids_otu = sample.otu_ids
                                // Add the OTU lettering to each OTU ID and return collect as a new array
                                ids_OTU = ids_otu.map(otu => `OTU ${otu}`)
                                // Extract the otu_labels for the hovertext
                                var hovertext = sample.otu_labels
                
                                // console.log()
                                updateBarplot(ids_OTU, svals, hovertext);
                                updateBubbleplot(ids_otu, svals, hovertext);
                                update_demog(new_value);
                                update_gauge(data, new_value)
                        }
                })
        })
}

// This function updates the bar plot when a new test subject is selected. This function is called by optionChanged, which passes in the new ids, values, and hover text
var updateBarplot = function(id, value, htext) {
        var x = value.slice(0,9);
        var y = id.slice(0, 9);
        var text = htext.slice(0, 9);

        Plotly.restyle('bar', 'x', [x]);
        Plotly.restyle('bar', 'y', [y]);
        Plotly.restyle('bar', 'text', [text])
}

//  This function updates the bubble plot when a new test subject is selected. Similar to the updateBarplot function, this function is called by the optionChanged function
var updateBubbleplot = function(ids, value, htext) {
        var x = ids;
        var y = value;
        var text = htext

        Plotly.restyle('bubble', 'x', [x]);
        Plotly.restyle('bubble', 'y', [y]);
        Plotly.restyle('bubble', 'text', [text]);

}

// This function will update the demographic information when a new subject ID is selected. It is called by the optionChanged function, which passes in the new subject ID
var update_demog = function(subject_id) {
        // First remove all of the former paragraph elements within the '#sample-metadata' div
        d3.select('#sample-metadata')
        .selectAll('p').remove()
        // Read in the JSON object again
        d3.json(queryURL).then(function(data) {
                // Iterate through each object (test subject) of the metadata array
                data.metadata.forEach(subject => {
                        // For the current object (subject), if the id of the subject is equal to the subject_id that was passed in by optionChanged, proceed to update the DOM with information from this subject. Note the unlike some of the other arrays in this dataset, in this case subject.id is a number, whereas subject_id that is passed into the function is a string. Therefore, subject.id must be converted into a string in in order for the test for equality to execute properly
                        if (subject.id.toString() === subject_id) {
                                // Next, iterate over all of the key:value pairs of that subject as before, appending new paragraph elements with the updated information from the new subject id
                                Object.entries(subject).forEach(function([key, value]) {
                                        // console.log(key, value)
                                        d3.select('#sample-metadata')
                                        .append('p')
                                        .text(`${key}: ${value}`)
                                })  
                        }
                })
        })
}

// This function will update the gauge based on the wfreq of the newly selected test subject. It is called by the objectChange() function and accepts are arguments (1) the data JSON object and (2) the subject ID number of hte newly selected test subject.
var update_gauge = function(data, subject_id) {
        // Iterate through each subject within the metadata array of the data JSON.
        data.metadata.forEach(subject => {
                // Find the subject whose id matches the passed in subject_id variable from the function call. When a match is found, find the wash frequency (wfreq) value of that subject and set it equal to "washes"
                if (subject.id.toString() === subject_id) {
                        var washes = subject.wfreq
                        // console.log(washes)
                }
                // Finally, update the gauge with the new value of belly button washes per week.
                Plotly.restyle('gauge', 'value', [washes])
        })
}