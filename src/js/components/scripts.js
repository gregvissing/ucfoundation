function headerHeight(element) {
	var headerHeightValue = element.outerHeight();
	// console.log("checked height");
	return headerHeightValue;
}

$("main").css("margin-top", headerHeight($("header")) + "px");

ScrollTrigger.create({ start: 'top -80', end: 99999, toggleClass: {className: 'reduced', targets: '.site-head'}});

$(function () {
	$("input.SearchTextBox").attr("placeholder", "Search");

	var $div1 = $("#search");
	$(".search > a").on("click", function (e) {
		e.preventDefault();

		$div1.toggleClass("isOpen").slideToggle();
		var isOut = $div1.hasClass("isOpen");
		$div1.animate({
			marginTop: isOut ? "" : "-55px"
		}, 300);
	});
});

$(document).ready(function() {
	function updateUrl(url, key, value) {
		if (value !== undefined) {
			value = encodeURI(value);
		}
		var hashIndex = url.indexOf("#") | 0;
		if (hashIndex === -1) hashIndex = url.length | 0;
		var urls = url.substring(0, hashIndex).split("?");
		var baseUrl = urls[0];
		var parameters = "";
		var outPara = {};
		if (urls.length > 1) {
			parameters = urls[1];
		}
		if (parameters !== "") {
			parameters = parameters.split("&");
			for (k in parameters) {
				var keyVal = parameters[k];
				keyVal = keyVal.split("=");
				var ekey = keyVal[0];
				var evalue = "";
				if (keyVal.length > 1) {
					evalue = keyVal[1];
				}
				outPara[ekey] = evalue;
			}
		}

		if (value !== undefined) {
			outPara[key] = value;
		}
		else {
			delete outPara[key];
		}
		parameters = [];
		for (var k in outPara) {
			parameters.push(k + "=" + outPara[k]);
		}

		var finalUrl = baseUrl;

		if (parameters.length > 0) {
			finalUrl += "?" + parameters.join("&");
		}

		return finalUrl + url.substring(hashIndex);
	}

	function setURLparams() {
		var donateUrl = $("a.donate").attr("href");
		var amountUrl = $(".dollar-box.active input").data("value");
		var typeUrl = $(".gift-box.active input").data("value");
		var customAmount = $("#custom-amount").val();

		if (customAmount != "") {
			amountUrl = customAmount;
		}

		console.log(amountUrl);
		var myURL = donateUrl;

		myURL = updateUrl(myURL, "amount", amountUrl);
		myURL = updateUrl(myURL, "type", typeUrl);
		console.log("added location..." + myURL);

		$("a.donate").attr("href", myURL);
	}

	function initMiniDonationFormValues() {
		$(
				".dollar-box input[data-value='100'], .gift-box input[data-value='One-Time']"
			)
			.parent()
			.addClass("active");
		document.getElementById("amountSelected").innerHTML = $(".dollar-box.active input").data("value");
		document.getElementById("giftTypeSelected").innerHTML = $(".gift-box.active input").val();

		setURLparams();
	}

	function setGiftTypes() {
		let arrGiftTypes = ["One-Time", "Monthly", "Pledge"];

		var giftHandles = document.querySelector(".gift-type-container");

		arrGiftTypes.forEach((element) => {
			console.log(element);

			var giftBox = document.createElement("div"),
				giftInput = document.createElement("input"),
				giftLabel = document.createElement("label");

			giftBox.classList.add("gift-box");
			giftInput.classList.add("btnGiftType");
			giftInput.setAttribute("type", "button");
			giftInput.setAttribute("data-value", element);
			giftInput.value = element;
			// giftLabel.textContent = element;

			giftBox.appendChild(giftInput);
			// giftBox.appendChild(giftLabel);

			giftHandles.appendChild(giftBox);
		});

		initMiniDonationFormValues();
	}

	function setAmounts() {
		let oneTimeDonationAmounts = [50, 100, 250, 500, 1000];
		let monthlyDonationAmounts = [10, 20, 30, 50, 84];
		let pledgeDonationAmounts = [100, 250, 500, 1000];

		var dollarHandles = document.querySelector(".dollar-handles");

		var arrAmounts = oneTimeDonationAmounts;
		arrAmounts.forEach((element) => {
			console.log(element);

			var amountBox = document.createElement("div"),
				amountInput = document.createElement("input"),
				amountLabel = document.createElement("label");

			amountBox.classList.add("dollar-box");
			amountInput.classList.add("btnDonAmount");
			amountInput.setAttribute("type", "button");
			amountInput.setAttribute("name", "amount");
			amountInput.setAttribute("data-value", element);
			amountInput.value = "$" + element;

			amountBox.appendChild(amountInput);
			// amountBox.appendChild(amountLabel);

			dollarHandles.appendChild(amountBox);
		});

		setGiftTypes();
	}

	$("#custom-amount").on("click", function(e) {
		e.preventDefault();
		$(".dollar-box").removeClass("active");
		$(this).focus();
		document.getElementById("amountSelected").innerHTML = 0;
		setURLparams();
	});

	$("#custom-amount").on("keyup", function(e) {
		e.preventDefault();
		document.getElementById("amountSelected").innerHTML = $("#custom-amount").val();
		setURLparams();
	});

	setAmounts();

	$(document).on("click", "div.dollar-box input", function() {
		let amount = $(this).data("value");
		document.getElementById("amountSelected").innerHTML = amount;
		$("#custom-amount").val("");

		$(".dollar-box input").each(function() {
			var thisAmount = $(this).data("value")
			if (thisAmount == amount) {
				$(this).parent().addClass("active");
			}
			else {
				$(this).parent().removeClass("active");
			}
		});

		setURLparams();
	});

	$(document).on("click", "div.gift-box input", function() {
		let gift = $(this).data("value");
		document.getElementById("giftTypeSelected").innerHTML = gift;

		$(".gift-box input").each(function() {
			var thisGift = $(this).data("value")
			if (thisGift == gift) {
				$(this).parent().addClass("active");
			}
			else {
				$(this).parent().removeClass("active");
			}
		});

		setURLparams();
	});
});