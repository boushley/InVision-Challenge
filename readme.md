# JavaScript TabUI Control

## Intro
This UI control was developed to fulfill the recruiting challenge for InVision.

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
