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

`initialize_barplot()` 
Creates an initial top 10 OTU bar plot representing the data from test subject **940**. Outside of this function, the read values, OTU IDs, and OTU labels are retrieved from the `samples` array of the JSON object. This data is then passed into `initialize_barplot()`, which assigns the data a trace object and uses the Plotly library to construct the bar plot.
