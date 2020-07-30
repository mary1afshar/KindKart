console.log('popup running');

chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
    let url = tab.url;
    domain = url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
    document.getElementById('domain_name').textContent = domain;
    chrome.storage.sync.set({url1: domain});
  });


function getDomain(callback) {
    chrome.storage.sync.get(['url1'], callback);
    console.log(url1)
}

getDomain();

var brand = "this Company";
var overall = "N/A";
var myid = chrome.i18n.getMessage("@@extension_id");


chrome.runtime.sendMessage({command: "fetch", data: {domain: domain}}, (response) => {
    //response from the database (background.html > firebase.js)
    parseCoupons(response.data, domain);
});

// georgia's functions to output ethical rating of each brand
var getRatings = function(domain) {
    let ratings = [
        ["Abercrombie & Fitch", "D-", "B-", "D-", "A", "F", "F", "abercrombie.com"],
        ["adidas","A" ,"A+" ,"A+" ,"D-" ,"B-" , "B-","adidas.ca"],
        ["ALDI", "B-" ,"A+" ,"A-" ,"B+" ,"D-" , "D-","aldi.us"],
        ["Ally Fashion","F" ,"F ","F" ,"B-" ,"F" , "F","allyfashion.com"],
        ["Anthea Crawford","C" ,"A+" ,"D+" ,"F" ,"C-" , "C-","antheacrawford.com.au"],
        ["APG & Co","A" ,"A+" ,"A+" ,"C-" ,"B-" , "B-","apgandco.com"],
        ["Arcadia Group","-C+" ,"A+" ,"B" ,"A" ,"D- ", "D-","arcadiagroup.co.uk"],
        ['AS Colour','A' ,'A+' ,'A+' ,'C-' ,'B-' , 'B-','ascolour.com'],
        ['ASICS','-C' ,'A' ,'B' ,'A-' ,'D-' , 'D-','asics.com'],
        ['ASOS','B' ,'A+' ,'A-' ,'C' ,'C-' ,'C-','asos.com'],
        ['Baby City','F' ,'F' ,'F' ,'B' ,'F' , 'F','babycity.co.za'],
        ['Bardot','D+' ,'A-' ,'C-' ,'F' ,'F' , 'F','bardot.com'],
        ['Barkers Clothing','C+' ,'A+' ,'B+' ,'D-' ,'D' , 'D','barkersonline.co.nz'],
        ['Bec and Bridge','F' ,'F' ,'F' ,'D+' ,'F' , 'F','becandbridge.com'],
        ['Ben Sherman','D+','A-' ,'C-' ,'F' ,'D-' , 'D-','bensherman.com'],
        ['Betts Group','D' ,'A-' ,'D+' ,'C' ,'F' , 'F','betts.com.au'],
        ['Big W','B' ,'A+' ,'B+' ,'D' ,'D+' , 'D+','bigw.com.au'],
        ['Blue Illusion Boardriders','C+' ,'A+' ,'C+' ,'C+' ,'D' , 'D','blueillusion.com'],
        ['Forever 21','F' ,'B' ,'F' ,'F' ,'F' , 'F','forever21.com'],
        ['Fruit of the Loom','B' ,'A+' ,'A-' ,'C+' ,'C-' , 'C-','fruit.com'],
        ['Gap Inc.','A+' ,'A+' ,'A+' ,'A+' ,'A+' ,'A+','gapcanada.ca'],
        ['Gildan Activewear','D-' ,'A+' ,'F' ,'F' ,'F' ,'F','gildan.com'],
        ['H&M','A-' ,'A+' ,'A' ,'A' ,'C+' , 'C+','hm.com'],
        ['Hanesbrands','B+' ,'A+' ,'A-' ,'B' ,'C+' , 'C+','hanes.com'],
        ['Huffer','C' ,'A+' ,'B-' ,'C+' ,'D-' ,'D-','huffer.co.nz'],
        ['Hugo Boss Group','B-' ,'A+' ,'A' ,'C-' ,'D' , 'D','hugoboss.com'],
        ['Kmart' ,'A' ,'A+' ,'A+' ,'A-' ,'C-' , 'C-','kmart.com'],
        ['Lacoste','B' ,'A+' ,'B+' ,'B+' ,'F' , 'F','lacoste.com'],
        ['Levi Strauss & Co.','C-' ,'A+' ,'C-' ,'D+' ,'D-' , 'D-','levistrauss.com'],
        ['Liminal Apparel','B' ,'A+' ,'A-' ,'B-' ,'A+' , 'A+','liminal.org.nz'],
        ['Lowes','C+' ,'A+' ,'B-' ,'B-' ,'F' , 'F','lowes.ca'],
        ['Lululemon Athletica','A' ,'B-' ,'A' ,'D' ,'B-' , 'B-','shop.lululemon.com'],
        ['Patagonia','A' ,'A' ,'A' ,'A' ,'B'  ,'A' ,'patagonia.ca'],
        ['Target','B' ,'A' ,'A' ,'B' ,'C-','C-' ,'target.com'],
        ['Walmart','F','D','F','F','F','F-','walmart.ca'],
        ['Sephora','B','D','C','B','D','B','sephora.com']];
    for (r in ratings){

        if (domain == ratings[r][7]){
              return ratings[r];
            }
        }      
    return [];         
}

var formatRatings = function(domain){
    if (getRatings(domain)[0]===undefined){
        var ethicalrating = "Sorry! We do not have a report for this website yet.";
    }
    else{
      var r = getRatings(domain);
      ethicalrating = "Overall: " + r[1] +"<br>"
      +"Worker Empowerment: " + r[2]+"<br>"
      +"Supplier Relations: " + r[3]+"<br>"
      +"Transparency: " + r[4]+"<br>"
      +"Enviromental Sustainability: " + r[5]+"<br>"
      +"Policies: " + r[6]+"<br>"

      brand = r[0];
      overall = r[1];
    }
    return ethicalrating;
}

var ethicalrating = formatRatings(domain);

var ffDomain = window.location.href;

var slashList = ffDomain.split("/");
var slash = slashList[slashList.length-1];

var searchTerm = function(slash){
    var ins = true;
    var k = ["1", "  ", "2", "3","4","5","6","7","8","9", "0", "?", "="];
    for (klen in k +1){
        while (ins == true){
            var m = slash.indexOf(k[klen]);
            var newTerm = slash.replace(k[klen],"");
            slash = newTerm
            if (m==-1){
                ins = false;
            }

        }
        ins=true;
    }
    var g = ["-", "%", "_"];
    for (glen in g +1){
        while (ins == true){
            var m = slash.indexOf(g[glen]);
            var newTerm = slash.replace(g[glen],"+");
            slash = newTerm
            if (m==-1){
                ins = false;
            }

        }
        ins=true;
    }


    return newTerm.substr(0,45);
}

var words = searchTerm(slash);



// not rewritten 
var submitCoupon = function(code, desc, domain){
    console.log('submit coupon', {code: code, desc: desc, domain: domain});
    chrome.runtime.sendMessage({command: "post", data: {code: code, desc: desc, domain: domain}}, (response) => {
        submitCoupon_callback(response.data, domain);
    });
}

//not rewritten
var submitCoupon_callback = function(resp, domain){
    console.log('Resp:', resp);
    document.querySelector('._submit-overlay').style.display='none';
    alert('Coupon Submitted!');
}

// not rewritten
var parseCoupons = function(coupons, domain) {

    try{
        var couponHTML = '';
        for (var key in coupons){
            var coupon = coupons[key];
            couponHTML += '<li><span class="code">'+coupon.code+'</span>'
            +'<p>'+coupon.description+'</p></li>';
    }
    if(couponHTML ==''){
        couponHTML = '<p>No coupons found</p>';
}
    document.getElementById('coupons').innerHTML = couponHTML;

    var couponSubmitOverlay = document.createElement('div');
    couponSubmitOverlay.className = '_submit-overlay';
    couponSubmitOverlay.innerHTML = '<span class="close">x</span>'
    +'<h3>Submit a coupon for this site</h3>'
    +'<div></label>Code:</label><input type="text" class="code"/></div>'
    +'<div><label>Description:</label><input type="text" class="desc"/></div>'
    +'<div><button class="submit-coupon">Submit Coupon</button></div>'
    couponSubmitOverlay.style.display = 'none';
    document.body.appendChild(couponSubmitOverlay);

    createEvents();

    }catch(e){
        console.log('no coupons found', e);
    }
}

// passing variables to popup.html    
document.getElementById('brand').innerHTML = brand;
document.getElementById('ethicalrating').innerHTML = ethicalrating;



if (overall == "N/A") {
    document.getElementById('ratingmessage').innerHTML = "Alternative Sites";

}
else if (overall == "A" || overall == "B+" || overall == "B" || overall == "B-"){
    document.getElementById('ratingmessage').innerHTML = "Good website! Alternatives just in case...";

}
else{
    document.getElementById('ratingmessage').innerHTML = "Uh oh. You may want to look at alternatives...";
}

// not rewritten
var copyToClipboard = function(str){
    var input = document.createElement('textarea');
    input.innerHTML = str;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
}

// not rewritten
var createEvents = function(){

    document.querySelectorAll('._coupon__list .code').forEach(codeItem => {
        codeItem.addEventListener('click', event=> {
            var codeStr = codeItem.innerHTML;
            copyToClipboard(codeStr);
        });
    });

    document.querySelector('._submit-overlay .close').addEventListener('click', function(event){
        document.querySelector('._submit-overlay').style.display = 'none';
    });

    document.querySelector('._coupon__list .submit-button').addEventListener('click', function(event){
        document.querySelector('._submit-overlay').style.display = 'block';
    });

    document.querySelector('._submit-overlay .submit-coupon').addEventListener('click', function(event){
        var code = document.querySelector('._submit-overlay .code').value;
        var desc = document.querySelector('._submit-overlay .desc').value;
        submitCoupon(code, desc, window.domain);
    });
}