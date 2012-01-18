describe('tabui', function () {
    var fixture
      , tabControl
      , defaultContents = 
            '<div style="width: 400px; height: 300px;"><ul>' +
                '<li> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
                '<li class="selected"> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
                '<li> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
            '</ul></div>'
      , multipleSelectedContents =
            '<div style="width: 400px; height: 300px;"><ul>' +
                '<li class="selected"> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
                '<li class="selected"> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
                '<li class="selected"> <h3>Some Tab</h3> <div> <h4>This is my tab content</h4> <p>Some more content</p> <ul><li>child</li></ul> </div> </li>' +
            '</ul></div>'
      , generateDefaultFixture = function () { 
            fixture = $(defaultContents).appendTo('body');
            tabControl = fixture.tabui();
        };

    afterEach(function () {
        if (fixture)
            fixture.remove();
        fixture = null;
    });

    it('should throw if the target has no ul as a child', function () {
        fixture = $('<div></div>').appendTo('body');

        expect(function () { fixture.tabui(); }).toThrow(new Error('TabUI expects a ul within the target container.'));
    });

    it('should find the immediate child ul within the container', function () {
        generateDefaultFixture();

        expect(tabControl.list[0]).toBe(fixture.children('ul')[0]);
    });

    it('should create a tab per list item', function () {
        generateDefaultFixture();

        expect(tabControl.tabs.length).toBe(3);
    });

    it('should hide all the contents besides the selected one', function () {
        generateDefaultFixture();

        var isSelected
          , isVisible
          , index
          , tab;

        for (index in tabControl.tabs) {
            var tab = tabControl.tabs[index];
            isSelected = tab.isSelected
            isVisible = tab.body.is(':visible');

            expect(isVisible).toBe(isSelected);
        }
    });

    it('should only allow one selected tab', function () {
        fixture = $(multipleSelectedContents).appendTo('body');

        var tabControl = fixture.tabui()
          , numberSelected = 0
          , index
          , tab;

        for (index in tabControl.tabs) {
            var tab = tabControl.tabs[index];
            if (tab.isSelected)
                numberSelected++;
        }

        expect(numberSelected).toBe(1);
    });

    it('should unselect any selected tabs when a new tab is selected', function () {
        generateDefaultFixture();

        var selectedTab
          , unselectedTab
          , index
          , tab;

        for (index in tabControl.tabs) {
            tab = tabControl.tabs[index];

            if (tab.isSelected)
                selectedTab = tab;
            else
                unselectedTab = tab;
        }

        expect(selectedTab.isSelected).toBe(true);
        expect(unselectedTab.isSelected).toBe(false);

        unselectedTab.select();

        expect(selectedTab.isSelected).toBe(false);
        expect(unselectedTab.isSelected).toBe(true);
    });

    it('should change the visible content to match the selected tab', function () {
        generateDefaultFixture();

        var selectedTab
          , unselectedTab
          , index
          , tab;

        for (index in tabControl.tabs) {
            var tab = tabControl.tabs[index];

            if (tab.isSelected)
                selectedTab = tab;
            else
                unselectedTab = tab;
        }

        expect(selectedTab.isSelected).toBe(true);
        expect(selectedTab.body.is(':visible')).toBe(true);

        expect(unselectedTab.isSelected).toBe(false);
        expect(unselectedTab.body.is(':visible')).toBe(false);

        unselectedTab.select();

        expect(selectedTab.isSelected).toBe(false);
        expect(selectedTab.body.is(':visible')).toBe(false);

        expect(unselectedTab.isSelected).toBe(true);
        expect(unselectedTab.body.is(':visible')).toBe(true);
    });

    it('should fire the selection changed handler when the active tab changes', function () {
        var selectedTab
          , unselectedTab
          , index
          , tab
          , changeHandler = jasmine.createSpy('changeHandler');

        fixture = $(defaultContents).appendTo('body');
        tabControl = fixture.tabui({'tabChangeHandler': changeHandler});

        for (index in tabControl.tabs) {
            var tab = tabControl.tabs[index];

            if (!tab.isSelected) {
                unselectedTab = tab;
                break;
            }
        }

        unselectedTab.select();

        expect(changeHandler).toHaveBeenCalled();
    });

    it('should fire the selection changed handler when the active tab changes, with the newly selected tab as an argument', function () {
        var selectedTab
          , unselectedTab
          , index
          , tab
          , changeHandler = jasmine.createSpy('changeHandler');

        fixture = $(defaultContents).appendTo('body');
        tabControl = fixture.tabui({'tabChangeHandler': changeHandler});

        for (index in tabControl.tabs) {
            var tab = tabControl.tabs[index];

            if (!tab.isSelected) {
                unselectedTab = tab;
                break;
            }
        }

        unselectedTab.select();

        expect(changeHandler).toHaveBeenCalledWith(unselectedTab);
    });

    it('should not fire the selection changed handler when the active tab is "selected" again', function () {

        var selectedTab
          , unselectedTab
          , index
          , tab
          , changeHandler = jasmine.createSpy('changeHandler');

        fixture = $(defaultContents).appendTo('body');
        tabControl = fixture.tabui({'tabChangeHandler': changeHandler});

        for (index in tabControl.tabs) {
            var tab = tabControl.tabs[index];

            if (tab.isSelected)
            {
                selectedTab = tab;
                break;
            }
        }

        selectedTab.select();

        expect(changeHandler).wasNotCalled();
    });
});
