/* 
 * jwizard-bootstrap
 * Emeric BAVEUX
 */

 window.getSandBox = function() {
    $("#sandbox").html("");
    return $("#sandbox");
};

function wizardTestInit(wrapper) {
    window.wizardTest = {
        wizardCb: false,
        page1Cb: false,
        page2Cb: false,
        page3Cb: false,
        conditionPage2: false
    };
    window.wizardtestcb1 = function() { return wizardTest.page1Cb = true; };
    window.wizardtestcb2 = function() { 
        if (wizardTest.conditionPage2 === true) {
            return wizardTest.page2Cb = true;
        } else {
            return false;
        } 
    };
    window.wizardtestcb3 = function() { return wizardTest.page3Cb = true;};
    wrapper.attr("data-title", "wizard1").append(
        $("<div/>").attr("data-title", "page1").addClass("page").attr("data-callback", "wizardtestcb1").append(
            'contenu1'
        ),
        $("<div/>").attr("data-title", "page2").addClass("page").attr("data-callback", "wizardtestcb2").append(
            'contenu2'
        ),
        $("<div/>").attr("data-enabled", "false").attr("data-title", "page3").addClass("page").attr("data-callback", "wizardtestcb3").append(
            'contenu3'
        )
    );
    wrapper.wizard({
        callback: function() {
            window.wizardTest.wizardCb = true;
        }
    });
}

QUnit.test( "wizard.goto", function( assert ) {
    var sandbox = getSandBox();
    wizardTestInit(sandbox);
    // Check init conditions
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, false);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(sandbox.data("pageNb"), 3);
    // Check if goto works
    sandbox.wizard("goto", 2);
    assert.equal(sandbox.data("page"), 2);
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    
    sandbox.wizard("goto", 1);
    assert.equal(sandbox.data("page"), 2);
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    wizardTest.conditionPage2 = true;
    sandbox.wizard("goto", 1);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, false);

    sandbox.wizard("goto", 3);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, false);
    sandbox.data("tabsUl").children().removeClass("disabled");
    sandbox.wizard("goto", 3);
    assert.equal(sandbox.data("page"), 3);
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, false);
    sandbox.wizard("goto", 1);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, true);
});
QUnit.test( "wizard.gotoDirect", function( assert ) {
    var sandbox = getSandBox();
    wizardTestInit(sandbox);
    sandbox.data("tabsUl").children().removeClass("disabled");
    wizardTest.conditionPage2 = true;
    // Check init conditions
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, false);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(sandbox.data("pageNb"), 3);
    
    // Check if goto works
    sandbox.wizard("goto", 3);
    assert.equal(sandbox.data("page"), 3);
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, false);

});

QUnit.test( "wizard.nextprevious", function( assert ) {
    var sandbox = getSandBox();
    wizardTestInit(sandbox);
    var next = sandbox.find(".nextButton");
    var previous = sandbox.find(".previousButton");
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, false);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(sandbox.data("pageNb"), 3);
    
    
    previous.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(sandbox.data("pageNb"), 3);
    
    next.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 2);
    assert.equal(sandbox.data("pageNb"), 3);
    next.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 2);
    assert.equal(sandbox.data("pageNb"), 3);
    wizardTest.conditionPage2 = true;
    next.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 2);
    assert.equal(sandbox.data("pageNb"), 3);
    sandbox.data("tabsUl").children().removeClass("disabled");
    next.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 3);
    assert.equal(sandbox.data("pageNb"), 3);
    next.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, true);
    assert.equal(sandbox.data("page"), 3);
    assert.equal(sandbox.data("pageNb"), 3);
    previous.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, true);
    assert.equal(sandbox.data("page"), 2);
    assert.equal(sandbox.data("pageNb"), 3);
    previous.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, true);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(sandbox.data("pageNb"), 3);
    previous.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, true);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(sandbox.data("pageNb"), 3);
});

QUnit.test( "wizard.ulclick", function( assert ) {
    var sandbox = getSandBox();
    wizardTestInit(sandbox);
    var li1 = $(sandbox.data("tabsUl").children()[0]);
    var li2 = $(sandbox.data("tabsUl").children()[1]);
    var li3 = $(sandbox.data("tabsUl").children()[2]);
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, false);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(sandbox.data("pageNb"), 3);
    
    li2.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 2);
    assert.equal(sandbox.data("pageNb"), 3);
    li1.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, false);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 2);
    assert.equal(sandbox.data("pageNb"), 3);
    wizardTest.conditionPage2 = true;
    li1.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(sandbox.data("pageNb"), 3);
    li3.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(sandbox.data("pageNb"), 3);
    sandbox.data("tabsUl").children().removeClass("disabled");
    li3.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, false);
    assert.equal(sandbox.data("page"), 3);
    assert.equal(sandbox.data("pageNb"), 3);
    li1.click();
    assert.equal(wizardTest.wizardCb, false);
    assert.equal(wizardTest.page1Cb, true);
    assert.equal(wizardTest.page2Cb, true);
    assert.equal(wizardTest.page3Cb, true);
    assert.equal(sandbox.data("page"), 1);
    assert.equal(sandbox.data("pageNb"), 3);
});