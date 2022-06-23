# Filter/Sort controls (`filter-sort-ctrl`)

* [Introduction](#introduction)
* [Filtering](#filtering)
  * [Text](#text-filters)
  * [Number (inlcuding date & date/time)](#number-including-date--datetime-filters)
  * [Boolean (Yes/No)](#boolean-truefalse-filters)
  * [Fixed option](#fixed-option-filters)
  * [Filtering on multiple fields](#filtering-on-multiple-fields)
* [Sorting](#sorting)
  * [Text](#text-sorting)
  * [Date & Date time sorting](#date--date-time-sorting)
  * [Boolean (Yes/No)](#boolean-yesno-sorting)
  * [Fixed option](#fixed-option-sorting)
  * [Sorting on multiple fields](#sorting-on-multiple-fields)
-----
## Introduction

`filter-sort-ctrl` is intended to provide for filtering & sorting
objects by a single field.

The aim of this component is that it can be dropped into a listing
table's column header and provide a simple UI for the end user to
filter the contents of the table based on values in the column.

> __NOTE:__ This component doesn't provide any functionality for
>           actually filtering content. It only provides a user
>           interface for controlling filter settings.

## Filtering

There are four types of filter controls:

* Text
* Number (inlcuding date & date/time)
* Boolean (Yes/No)
* Fixed option

### Text filters

If the filter text is found anywhere in the text being filtered on,
it is considered a match.

> __NOTE:__ To help with filtering text is converted to lowercase
>           before being filtered

#### TODO:
1. Allow matching on multiple text fragments
2. Matching from start or end only of text

### Number (including date & date/time) filters

Number filters provide for two types of filtering:
* Single value filtering (i.e. match on a specific number) or
* Min/Max filtering (i.e. Filter by minimum value and/or maximum value)

#### Max Date (only) filter

Because Date & Date/Time fields are converted to Unix timestamps (seconds after 1970-01-01), If you set the max value to the same as the min value, then only things that match the exact second will be included. This is rarely what the user wants. In these cases a max date field will have the number of seconds in a day (less 1 second) added to it's value so the max date would represent 23:59:59 for the date set. This allows the user to have any time on the max date be included in the filtered results, rather than having to think about it and set the max date to the following day.

### Boolean (True/False) filters

For boolean data (true/false) data there are times when you want only
include Yes/true or only include no/false values and therest of the
time you don't care.

Boolean filters have three states "Ignore", "True" or "False"
(0, 1 & -1respectively)


### Fixed Option filters

Fixed option filtering is for when a field/column contains a known, & 
limited set of options (e.g. the values in a `<SELECT>` field). 
For each option in the list there is an "Ignore", "True" & "False" 
select so your filter can include multiple options.


### Filtering on multiple fields


---

## Sorting

### Text sorting

If a value is text (even if that text is numeric) it will be sorted
by it's text value (e.g. if you have two values "9" & "12345",
"12345" will be sorted before "9" because sorting is done character
by character)

> __NOTE:__ Text is converted to lower case before sorting to minimise

### Date & Date time sorting

Date & date/time values are converted to numbers (Unix time stamp /
i.e. seconds after 1970-01-01), so they can be easily sorted.

### Boolean (Yes/No) sorting

Boolean values are converted to numbers (`TRUE` = 1, `FALSE` = 0) and
sorted accordingly

### Fixed option sorting

By default fixed option fields are sorted as text by option label but
can be toggled to sort by option value (usually numeric)

### Sorting on multiple fields

When multiple `filter-sort-ctrl` are used for the same set of objects,
each time a sort field is changed, it will be moved to the end of
the list of sort fields and so will be applied last. This means that
morerecently a sort setting has been set the bigger the influence
over the sorting it will have.

> __NOTE:__ For some many data types there will be so many unique
>           values that a there is no overlap between sorted values
>           in different fields, so sorting by one field might
>           completely negate any previous sorting.
