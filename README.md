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

## Initializing the Dashboard
### Key functions
