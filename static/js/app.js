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

// This code block will initialize the dashboard with a barplot of the selected test subject
// d3.json(queryURL).then(function(data) {
//         data.samples.forEach(sample => {
//                 if (sample.id === '940') {
//                         var svals = sample.sample_values
//                         var labels = sample.otu_ids
//                         // Add the OTU lettering to each OTU ID and return collect as a new array
//                         labels_otu = labels.map(label => `OTU ${label}`)
//                         // Extract the otu_labels for the hovertext
//                         var hovertext = sample.otu_labels
//                         // console.log(labels_otu)
//                         initialize_barplot(labels_otu, svals, '940', hovertext)
//                         // console.log(svals)
//                         // console.log(`OTU ${labels}`)
//                 }
//         })
// })

// This code block will initialize the dashboard with a barplot and bubble plot of the first test subject, which is the first object in the data.samples array
d3.json(queryURL).then(function(data) {
        var svals = data.samples[0].sample_values
        var labels = data.samples[0].otu_ids
        // Add the OTU lettering to each OTU ID and return collect as a new array
        var labels_otu = labels.map(label => `OTU ${label}`)
        // Extract the otu_labels for the hovertext
        var hovertext = data.samples[0].otu_labels
                        // console.log(labels_otu)
        initialize_barplot(labels_otu, svals, hovertext)
                        // console.log(svals)
                        // console.log(`OTU ${labels}`)
        initialize_bubbleplot(labels, svals, hovertext)
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
                title: "Sequencing Reads for All UTO IDs",
                xaxis: {
                        title: "OTU ID"
                },
                yaxis: {
                        title: "Sequencing Read Counts"
                }
        };

        Plotly.newPlot('bubble', data, layout)
}

// Write the optionChanged function, which takes as an argument the value of the #selDataset when a change is detected by the DOM. Using this ID, extract the otu_ids, values, and labels, and pass them into the function updateBarplot()
var optionChanged = function(new_value) {
        d3.json(queryURL).then(function(data) {
                data.samples.forEach(sample => {
                        if (sample.id === new_value) {
                                var svals = sample.sample_values
                                var labels = sample.otu_ids
                                // Add the OTU lettering to each OTU ID and return collect as a new array
                                labels_otu = labels.map(label => `OTU ${label}`)
                                // Extract the otu_labels for the hovertext
                                var hovertext = sample.otu_labels
                                // console.log(labels_otu)
                                updateBarplot(labels_otu, svals, new_value, hovertext)
                                updateBubbleplot(labels, svals, hovertext)
                        }
                })
        })
}

// This function updates the bar plot when a new test subject is selected. This function is called by optionChanged, which passes in the new ids, values, subject_id, and hover text
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
populate_names()
