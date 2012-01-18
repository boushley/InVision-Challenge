# JavaScript TabUI Control

## Intro
This UI control was developed to fulfill the [recruiting challenge](http://bit.ly/front-end-developer-challenge) for InVision.

A running example of this app can be seen as a [jsfiddle here](http://jsfiddle.net/boushley/cYS6U/).

## (light) Documentation
The TabUI implementation functions in one of two ways. You can create the control directly:

```javascript
var tabControl = new TabUI.TabControl(baseElement);
```

or through a jQuery extension method:

```javascript
var tabControl = $('.tabs').tabui();
```

Options can be provided as an extra parameter to either of these methods. The optiosn availabe are:

* tabChangeHandler: A function to be called when the active tab changes
* tabHeight: The height to make the tabs
* selectedClass: The class to apply to the tabs when they are selected
* eagerLoadContent: This flag determines whether tabs with ajax loaded content is loaded when the control is created or 
  when the tab is selected.

The tab control should fit the following format:

```html
<div> <!-- This div is the element you should call tabui on. The "container" div. -->
    <ul> <!-- It is required that there be a ul or ol inside of this list -->
        <li> <!-- A list item is provided for each tab -->
            <h3>Header (can be h1-h6)</h3> <!-- This header is used as the content of the tab for this tab -->
            <div> <!-- A div is required within the li to represent the body of the tab -->
                Tab Contents
            </div>
        </li>
    </ul>
</div>
```

All of the content is in the markup, however the javascript will move the body ```div``` for each tab out into the
container ```div```. The body ```div``` can have a ```data-content-url``` attribute that specifies an address to
load its contents from.

By default the first element in the list will be the selected tab when the control is initialized. To customize this
you can add the selected class (```selected``` by default) to the ```li``` that you want to be selected by default.

## Cross-Browser Disclaimer
This implementation has been tested in Chrome(17.0.963.33) and Firefox(9.0.1) on Mac. It makes use of border-radius
without any vendor prefixes, and thus will only work in modern/up-to-date browsers.
