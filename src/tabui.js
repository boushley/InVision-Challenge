(function ($, undefined) {

    $.fn.tabui = function () {
        var control = new TabUI.TabControl(this);
        return control;
    };

    window.TabUI = {};

    TabUI.TabControl = function (baseElement) {
        var base = this.base = $(baseElement)
          , list = this.list = this.base.children('ul')
          , tabs = this.tabs = []
          , lis = list.children('li')

          , width = base.width()
          , height = base.height()
          , tabWidth = Math.floor((width / lis.length))

          , isSomethingSelected = false

          , selectHandler = function (e, selectedTab) {
              for (var i in tabs) {
                  var tab = tabs[i];

                  if (tab === selectedTab)
                      tab.processSelect();
                  else
                      tab.processUnselect();
              }
            }

        if (list.length < 1)
            throw new Error(TabUI.INVALID_CONTENTS);

        lis.each(function () {
            var tab = new TabUI.Tab(this);

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
        TabUI.Util.setDimensions(list, width, TabUI.TAB_HEIGHT);
        lis.each(function () {
            $this = $(this);
            TabUI.Util.setDimensions($this, tabWidth, TabUI.TAB_HEIGHT);
            $this.css({'float': 'left'});
        });
    };

    TabUI.Tab = function (baseElement) {
        var base = this.base = $(baseElement)
          , body = this.body = base.children('div')
          , header = this.header = base.children('h1,h2,h3,h4,h5,h6')
          , self = this;

        // Setup the selection methods
        this.select = function () {
            base.trigger(TabUI.SELECT_EVENT, self);
        };
        base.click(this.select);
        header.click(this.select);

        // Method to put the tab into the selected state
        this.processSelect = function () {
            base.addClass(TabUI.SELECTED_CLASS);
            body.show();
            this.isSelected = true;
        };

        // Method to put the tab into the unselected state
        this.processUnselect = function () {
            base.removeClass(TabUI.SELECTED_CLASS);
            body.hide();
            this.isSelected = false;
        };

        // Setup the styles of the header
        header.css({'display': 'inline'});

        // Lets make sure the body is in the correct state
        this.isSelected = base.hasClass(TabUI.SELECTED_CLASS);
        if (this.isSelected)
            body.show();
        else
            body.hide();
    };

    TabUI.TAB_HEIGHT = 25;
    TabUI.SELECTED_CLASS = 'selected';
    TabUI.SELECT_EVENT = 'selected';
    TabUI.ACTIVE_TAB_CHANGE_EVENT = 'tab-changed'
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
