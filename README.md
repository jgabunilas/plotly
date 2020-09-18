# Plotly Homework Challenge - Belly Button Microbial Diversity

## Introduction
In this assignment an interactive data dashboard was created from an extensive [2012 belly button microbiome study](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0047712) conducted by Hulcr and colleagues that was published in the peer-reviewed scientific journal PloS One. In this study, the authors found that there is an astonishing degree of bacterial diversity within human navels, but that a small number of taxa tended to dominate the microbial communities across most humans tested. Most of the remaining species appeared in only a few navels.

Due to the interactive nature of the dashboard, this assignment makes extensive use of the D3 library in JavaScript to create event listeners and event handlers to keep the dashboard appropriately updated. All visualizations are created with the Plotly JavaScript library.

## The Dataset
The raw data was provided as a json object consisting of three key:array pairs: `names`, `metadata`, and `samples`.

**names**
The names array is a simple list of test subject IDs, one for each subject who provided a belly button microbiome sample. 

**metadata**
The metadata array consists of a series of JavaScript objects, one object per subject ID. Each object further contains seven key:value properties describing the subject's ID number, ethnicity, gender, age, location, type of belly button (innie or outie), and the weekly frequency at which subjects wash their belly buttons.

**samples**
The samples array likewise contains a series of JavaScript objects, one object per subject ID. Each object further contains three key:value pairs describing the following:
- Subject ID: the numerical ID number assigned to each individual subject, congruent with the subject IDs provided in the **names** and **metadata** arrays.
- OTU IDs: Each OTU, or operation taxonomic unit, was assigned a unique ID number. While not technically correct, for the purposes of this assignment, an OTU ID can be considered roughly synonymous with a species ID.
- OTU Labels: Each OTU was also assigned a label based on the lowest identifiable taxonomic level of that OTU.

## Dashboard Layout
The dashboard contains five primary components
1. Subject ID selector - allows the user to select a test subject and view data corresponding to the belly button microbiome analyzed from that subject
2. Demographic Info Card - contains demographic information for that test subject obtained from the metadata
3. Top 10 OTU Bar Plot - a horizontal bar plot displaying the sequencing read counts for the top 10 most abundant OTUs from that subject's belly button
4. OTU Bubble Plot - a bubble plot showing the number of sequencing reads for *all* OTUs from that subject's belly button. The markers are sized in proportion to the number of reads
5. Wash Frequency Gauge - a gauge that indicates how many times a week that subject washes his or her belly button.

## Initializing the Dashboard
The dashboard initializes to the data pertaining to the first subject in the dataset, subject 940. Key functions for the initialization:

`populate_names()` 
Populates the test subject ID selection dropdown menu (`select`) with the ID numbers of each subject. This is accomplished by reading the JSON object, retrieving the ID numbers from the `names` array and appending a new `option` element to the `select` object for each ID number. The `text` property of each `option` object is set to the ID number so that it will display on the webpage.

`initialize_demog()`
Initializes the demographic information display with the data pertaining to subject **940**. Each piece of information is a key:value pair within the `metadata` array of the JSON object. Therefore, this function iterates over each of these pairs and appends a new `<p>` element for each one, setting the text property of that new element based on the key:value pair. 


`initialize_barplot()` 
Creates an initial top 10 OTU bar plot representing the data from test subject **940**. Outside of this function, the read values, OTU IDs, and OTU labels are retrieved from the `samples` array of the JSON object. This data is then passed into `initialize_barplot()`, which assigns the data a trace object and uses the Plotly library to construct the bar plot.

`initialize_bubbleplot()`
This function initializes the bubble plot for test subject **940**. Similar to the barplot, this function takes as arguments the OTU IDs, sequencing read values, and OTU labels retrieved from the `samples` array of the JSON object. The function then constructs the initial bubbleplot based on the provided data. Unlike the barplot which describes only the top 10 OTUs, the bubbleplot is designed to display the sequencing read counts for *all* OTUs. 

`initialize_gauge()`

## Updating the Dashboard
When the user selects a different test subject ID from the dropdown menu, the dashboard is programmed to refresh in real-time to display the information pertaining to the newly-selected test subject. Key functions for updating the dashboard:

`optionChanged()`
This function is called by the HTML `#selDataset` subject ID selector element when a change is detected, specifically when a different subject ID is selected from the dropdown menu. It takes as an argument the new value (`new_value`) of `#selDataset`, which is equal to the value of the new subject ID `option` that was chosen from the dropdown menu. `optionChanged()` performs a number of tasks:
1. The `samples` array of the JSON data object is iterated over until an object is encountered whose `id` value is equal to the new value of `#selDataset`. 
2. When the matching object is encountered, the `sample_values`, `otu_ids`, `otu_labels` arrays are pulled from the object using standard object dot notation. 
3. These variables are then passed to the functions `updateBarplot()` and `updateBubbleplot` (see below).
4. `new_value` is passed to the function `update_demog` to update the demographics information card (see below).

`updateBarplot()`
The new OTU IDs, sequencing read values, and OTU labels pertaining to the newly selected subject ID are used to update the x, y, and text properties of the bar plot using `Plotly.restyle()`.

`updateBubbleplot()`
The new OTU IDs, sequencing read values, and OTU labels pertaining to the newly selected subject ID are used to update the x, y, and text properties of the bubble plot using `Plotly.restyle()`.

`update_demog()`
`update_demog()` is called by `optionChanged()`, which passes in the `new_value` of the new subject ID selected from `#selDataset`. `update_demog()` first removes all `<p>` elements from the `#sample-metadata` demographics card, clearing out the element. Next, the `metadata` array within the JSON object is iterated over for each object within. For each object, a conditional check is performed to determine if the value of the `id` key is equal to the `new_value` subject ID. Importantly, the subject ID within the `metadata` array object is a number, whereas `new_value` is a string, and it is necessary to convert the metadata value to a string for the conditional check to execute properly. When a match is found, the function iterates over each key:value pair of the matching object and appends a new `<p>` element to `#sample-metadata` for each pair, effectively updating the demographics information.
