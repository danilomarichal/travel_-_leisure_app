$(".go-back").on('click', function(){
  window.history.go(-1);
});

$(".go-go").on('click', function(){
  window.history.go(-1);
});

function clickCounter(){
  if(typeof(Storage)!=="undefined"){
    if(localStorage.clickC){
      localStorage.clickCount=Number(localStorage.clickC)+1;
    }else{
      localStorage.clickC=1;
    }
    $('#sum1').html(localStorage.clickC);

  }else{
   $('#sum1').html("broken");
  }
}

function clickCounterO(){
  if(typeof(Storage)!=="undefined"){
    if(localStorage.clickCo){
      localStorage.clickCo=Number(localStorage.clickCo)+1;
    }else{
      localStorage.clickCo=1;
    }
    $('#sum2').html(localStorage.clickCo);
  }else{
   $('#sum2').html("broken");
  }
}

function clickCounterT(){
  if(typeof(Storage)!=="undefined"){
    if(localStorage.clickCou){
      localStorage.clickCou=Number(localStorage.clickCou)+1;
    }else{
      localStorage.clickCou=1;
    }
    $('#sum3').html(localStorage.clickCou);
  }else{
   $('#sum3').html("broken");
  }
}

function clickCounterTh(){
  if(typeof(Storage)!=="undefined"){
    if(localStorage.clickCoun){
      localStorage.clickCoun=Number(localStorage.clickCoun)+1;
    }else{
      localStorage.clickCoun=1;
    }
    $('#sum4').html(localStorage.clickCoun);
  }else{
   $('#sum4').html("broken");
  }
}

function clickCounterF(){
  if(typeof(Storage)!=="undefined"){
    if(localStorage.clickCount){
      localStorage.clickCount=Number(localStorage.clickCount)+1;
    }else{
      localStorage.clickCount=1;
    }
    $('#sum5').text(localStorage.clickCount);
}else{
   $('#sum5').html("broken");
  }
}


//----------------------------------------------------

$('.bttn').click(function(e){
 event.preventDefault();
 $input = $('#country-info').val();
 callAjax();
})


var callAjax = function(){
    $.ajax({
        url:"https://restcountries.eu/rest/v2/name/"+$input,
        method:"GET",
        success: function(data){
          console.log(data);

  var country = $input;
  var code = data[0].alpha2Code;
  var region = data[0].region;
  var capital = data[0].capital;
  var population = data[0].population;
  var languages1 = data[0].languages[0].name;
  //var languages2 = data[0].languages[1].name
  var currency = data[0].currencies[0].name;


  $('#country').text("Country: "+data[0].name);
  $('#code').text("Two letters code: "+code);
  $('#region').text("Region :"+region);
  $('#capital').text("The capital city is: "+capital);
  $('#languages').text("Language/s: "+languages1);
  $('#population').text("This country has a population of: "+population+" habitants.");
  $('#currency').text("This country's currency is: "+currency);
  $('#flag').attr('src',data[0].flag);

    }
  });
}
