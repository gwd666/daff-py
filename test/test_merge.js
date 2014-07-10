var fs = require('fs');
var daff = require('daff');
var assert = require('assert');

var flags = new daff.CompareFlags();
var example = function() { 
    return new daff.TableView([["Name","Number"],["John",14],["Jane",99]]);
}
var ref = example();
var w = ref.get_width();
var h = ref.get_height();
for (var xa=0;xa<w;xa++) {
    for (var ya=1; ya<h; ya++) {
	for (var xb=0;xb<w;xb++) {
	    for (var yb=1; yb<h; yb++) {
		var a = example();
		var b = example();
		a.setCell(xa,ya,"zap_a");
		b.setCell(xb,yb,"zap_b");
		var c = example();
		c.setCell(xa,ya,"zap_a");
		c.setCell(xb,yb,"zap_b");
		var merger = new daff.Merger(ref,a,b,flags);
		var conflicts = merger.apply();
		if (xa==xb && ya==yb) {
		    assert(conflicts==1);
		} else {
		    assert(conflicts==0);
		    assert(a.isSimilar(c));
		}
	    }
	}
    }
}

{
    var t0 = new daff.TableView([["Name","Number"],["John",14],["Jane",99]]);
    var t1 = new daff.TableView([["Name","Number"],["Jane",99]]);
    var t2 = new daff.TableView([["Name","Number"],["Max",101],["John",14],["Jane",99]]);
    var t3 = new daff.TableView([["Name","Number"],["Max",101],["Jane",99]]);
    var merger = new daff.Merger(t0,t1,t2,flags);
    var conflicts = merger.apply();
    assert(conflicts==0);
    assert(t1.isSimilar(t3));
}

{
    var t0 = new daff.TableView([["Name","Number"],["John",14],["Jane",99]]);
    var t1 = new daff.TableView([["Name","Number","Dream"],["Jane",99,"Space"]]);
    var t2 = new daff.TableView([["Name","Number"],["Max",101],["John",14],["Jane",99]]);
    var t3 = new daff.TableView([["Name","Number","Dream"],["Max",101,null],["Jane",99,"Space"]]);
    var merger = new daff.Merger(t0,t1,t2,flags);
    var conflicts = merger.apply();
    assert(conflicts==0);
    assert(t1.isSimilar(t3));
}

{
    var t0 = new daff.TableView([["Name","Number"],["John",14],["Jane",99]]);
    var t1 = new daff.TableView([["Number","Dream","Name"],[99,"Space","Jane"]]);
    var t2 = new daff.TableView([["Name","Number"],["Max",101],["John",14],["Jane",99]]);
    var t3 = new daff.TableView([["Number","Dream","Name"],[101,null,"Max"],[99,"Space","Jane"]]);
    var merger = new daff.Merger(t0,t1,t2,flags);
    var conflicts = merger.apply();
    assert(conflicts==0);
    assert(t1.isSimilar(t3));
}

