# SvgFunnel.js

You can choose how you want to display your data on funnel graph. 
You can display exact numbers, you can display percentages or both.
The library will generate percentages automatically,
taking the largest number as 100% and then calculating 
other numbers as a fraction of the largest number.
For example: 12000, 5700 and 360 will be displayed as 47.5% and 3% 
(100% is skipped in order to avoid redundancy).

| 12000 | 5700  | 360 |
|-------|-------|-----|
|       | 47.5% | 3%  |

If you want to hide percentages you set `displayPercent` to `false`:

```js
{
    displayPercent: false
}
```

You can also display a vertical funnel graph: 
```js
{
    direction: 'vertical'
}
```

If you want to add a solid color to your funnel:
```js
{
    color: '#FF5500'
}
```

And if you want a gradient:
```js
{
    color: ['orange', 'red']
}
```
If you are using a gradient you can control the gradient direction using:

```js
{
    gradientDirection: 'vertical' // defaults to 'horizontal'
}
```


There are 3 ways to define data for the funnel graph.

The most simple way is do define a data array:

```js
data: [12000, 5700, 360]
```

this will create the data without titles. However you can still display the values as percentages, as number or both.

If you want to add labels to your numbers pass an array of labels to `data`.

```js
data: {
    'labels': ['Impressions', 'Add To Cart', 'Buy'],
    'values': [12000, 5700, 360]
}
```

That most explicit way to add data to the funnel graph.

If using one of those two ways, the `color` param must exist. 
And if you are using gradient as color, then you shall control
gradient direction with `gradientDirection` param. 
Otherwise it defaults to horizontal (left to right).

## Two-dimensional funnel graph

If you want to break down your data into more details,
you can use two-dimensional svg funnel graph. It will
generate a graph like this: [image]

In this example we will add more details to the previous example.
We have Impressions, Add To Cart and Buy data, however this time
we also want to visualize the data sources. So we want to see
the traffic sources, how much of them are direct, from ads
and from social media.

```js
data: [
    labels: ['Impressions', 'Add To Cart', 'Buy'],
    sublabels: ['Direct', 'Social Media', 'Ads'],
    colors: [
        {
            color: ['#FFB178', '#FF78B1', '#FF3C8E'],
            gradientDirection: 'vertical'
        },
        {
            color: 'red'
        },
        {
            color: ['blue']
        }
    ],
    values: [
        [2000, 4000, 6000],
        [3000, 1000, 1700],
        [200, 30, 130]
    ]
]
```
