$(".go-back").on('click', function(){
  window.history.go(-1);
});

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


  $('.country').text("Country: "+data[0].name);
  $('.code').text("Two letters code: "+code);
  $('.region').text("Region :"+region);
  $('.capital').text("The capital city is: "+capital);
  $('.languages').text("Language/s: "+languages1);
  $('.population').text("This country has a population of: "+population+" habitants.");
  $('.currency').text("This country's currency is: "+currency);
  $('#flag').attr('src',data[0].flag);

    }
  });
}
