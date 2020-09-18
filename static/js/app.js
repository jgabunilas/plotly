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
        initialize_demog()
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
                                updateBarplot(ids_OTU, svals, hovertext)
                                updateBubbleplot(ids_otu, svals, hovertext)
                                update_demog(new_value)
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

