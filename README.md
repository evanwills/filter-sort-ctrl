# Filter/Sort controls (`filter-control`)

## Introduction

`filter-control` is intended to provide for filtering & sorting
objects by a single field.


## Filtering

There are four types of filter controls:

* Text
* Number (inlcuding date & date/time)
* Boolean
* Fixed option

### Text

If the filter text is found anywhere in the text being filtered on,
it is considered a match.

> __NOTE:__ To help with filtering text is converted to lowercase
>           before being filtered

#### TODO:
1. Allow matching on multiple text fragments
2. Matching from start or end only of text

### Number (including date & date/time)



## Sorting

### Text

If a value is text (even if that text is numeric) it will be sorted
by it's text value (e.g. if you have two values "9" & "12345",
"12345" will be sorted before "9" because sorting is done character
by character)

> __NOTE:__ Text is converted to lower case before sorting to minimise

### Date & Date time

Date & date/time values are converted to numbers (Unix time stamp /
i.e. seconds after 1970-01-01), so they can be easily sorted.

### Boolean (Yes/No)

Boolean values are converted to numbers (`TRUE` = 1, `FALSE` = 0) and
sorted accordingly

### Fixed option

By default fixed option fields are sorted as text by option label but
can be toggled to sort by option value (usually numeric)

### Sorting on multiple fields

When multiple `filter-control` are used for the same set of objects,
each time a sort field is changed, it will be moved to the end of
the list of sort fields and so will be applied last. This means that
more recently a sort setting has been set the bigger the influence
over the sorting it will have.

> __NOTE:__ For some many data types there will be so many unique
>           values that a there is no overlap between sorted values
>           in different fields, so sorting by one field might
>           completely negate any previous sorting.
