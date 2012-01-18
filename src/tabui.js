(function ($, undefined) {

    $.fn.tabui = function (options) {
        var control = new TabUI.TabControl(this, options);
        return control;
    };

    window.TabUI = {};

    TabUI.TabControl = function (baseElement, options) {
        // Don't require an optiosn parameter
        options = options || {};

        var base = this.base = $(baseElement)
          , list = this.list = this.base.children('ul')
          , tabs = this.tabs = []
          , lis = list.children('li')

          , width = base.width()
          , height = base.height()
          , tabWidth = Math.floor((width / lis.length))
          , tabHeight = options.tabHeight || TabUI.DEFAULT_TAB_HEIGHT

          , isSomethingSelected = false
          , selectedClass = options.selectedClass || TabUI.DEFAULT_SELECTED_CLASS

          , tabOptions = {}
          , tabChangeHandler = options.tabChangeHandler || $.noop

          , selectHandler = function (e, selectedTab) {
              for (var i in tabs) {
                  var tab = tabs[i];

                  if (tab === selectedTab)
                      tab.processSelect();
                  else
                      tab.processUnselect();
              }

              tabChangeHandler(selectedTab);
            }

        if (list.length < 1)
            throw new Error(TabUI.INVALID_CONTENTS);

        tabOptions.selectedClass = selectedClass;
        lis.each(function () {
            var tab = new TabUI.Tab(this, tabOptions);

            if (tab.isSelected) {
                if (isSomethingSelected) {
                    tab.processUnselect();
                }
                isSomethingSelected = true;
            }

            // Do the general setup work for events and the body element
            tab.base.bind(TabUI.SELECT_EVENT, selectHandler);
            tab.body.remove();
            base.append(tab.body);

            // Set the width and height, and compensate for padding/border
            TabUI.Util.setDimensions(tab.body, width, height);

            // Save this tab to our list
            tabs.push(tab);
        });

        // If nothing is selected select the first tab
        if (!isSomethingSelected && tabs.length > 0)
            tabs[0].processSelect();

        // Set some styles for the headers
        TabUI.Util.setDimensions(list, width, tabHeight);
        lis.each(function () {
            $this = $(this);
            TabUI.Util.setDimensions($this, tabWidth, tabHeight);
            $this.css({'float': 'left'});
        });
    };

    TabUI.Tab = function (baseElement, options) {
        var base = this.base = $(baseElement)
          , body = this.body = base.children('div')
          , header = this.header = base.children('h1,h2,h3,h4,h5,h6')
          , selectedClass = options.selectedClass
          , self = this;

        // Setup the selection methods
        this.select = function () {
            if (!self.isSelected)
                base.trigger(TabUI.SELECT_EVENT, self);
        };
        base.click(this.select);
        header.click(this.select);

        // Method to put the tab into the selected state
        this.processSelect = function () {
            base.addClass(selectedClass);
            body.show();
            this.isSelected = true;
        };

        // Method to put the tab into the unselected state
        this.processUnselect = function () {
            base.removeClass(selectedClass);
            body.hide();
            this.isSelected = false;
        };

        // Setup the styles of the header
        header.css({'display': 'inline'});

        // Lets make sure the body is in the correct state
        this.isSelected = base.hasClass(selectedClass);
        if (this.isSelected)
            body.show();
        else
            body.hide();
    };

    TabUI.DEFAULT_TAB_HEIGHT = 25;
    TabUI.DEFAULT_SELECTED_CLASS = 'selected';
    TabUI.SELECT_EVENT = 'selected';
    TabUI.INVALID_CONTENTS = 'TabUI expects a ul within the target container.'

    TabUI.Util = {};
    TabUI.Util.setDimensions = function (element, width, height) {
        var extraDimension;

        element.width(width).height(height);

        extraDimension = element.outerWidth(true) - width;
        if (extraDimension)
            element.width(width - extraDimension);
        extraDimension = element.outerHeight(true) - height;
        if (extraDimension)
            element.height(height - extraDimension);
    };

})(jQuery)
