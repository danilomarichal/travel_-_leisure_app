const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const methodOverride = require('method-override');
var pg = require('pg');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);
var multer  = require('multer');
var path = require('path');
var upload = multer({ dest: 'public/uploads/' })


app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/html');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.use(bodyParser.json());




app.use(session({
  secret: 'TRAVELER',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
var scdb = pgp('postgres://rcoppa@localhost:5432/cities');
//var db = pgp('postgres://rcoppa@localhost:5432/travelers');
var herokuDb = 'postgres://wrerasuydxjhrz:0786436147d54b5295fa7523f5636d189c3af7f10ba256ef4bc0a7784a4e161f@ec2-107-21-108-204.compute-1.amazonaws.com:5432/d211ktdkh2v3fd';
var db = pgp(herokuDb);

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});



//---------------------------------------------
//LOGIN/ SIGN UP/ USERS TO DATABASE/ PASSWORD SECURITY


//CHECKS THAT USER's LOGIN BECOMES TRUE
//(CORRECT INFO) TO RENDER WELCOMING PAGE
app.get('/', function(req,res){
    if(req.session.user) {
      let data = {
        "logged_in": true,
        "email": req.session.user.email
      };
      res.render('index', data);

    } else {
      res.render('index');
    }
 });

app.get('/user', function(req,res){
    if(req.session.user) {
      let data = {
        "logged_in": true,
        "email": req.session.user.email
      };
      res.render('user/index', data);

    } else {
      res.render('user/index');
    }
 });


//USES USER's ENTERED INFO AND COMPARES
//EMAIL AND PASSWORD
//TO ALLOW ACCESS OR DENY IT
app.post('/login', function(req, res){
  let data = req.body;
 db
  .one("SELECT * FROM users WHERE email = $1", [data.email])
  .catch(function(){
    res.render("error/index");
  })
  .then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp) {
        req.session.user = user;
        res.redirect("/");
      } else {
        res.render("error/index");
      }
    })
  })
});

//home
app.get('/home', function(req, res){
  res.render("login/index");
})

//RENDERS SIGN UP PAGE
app.get('/signup', function(req, res){
  res.render('signup/index');
});

//Users profile
app.get('/user', function(req, res){
  res.render('user/index');
});

app.get('/user', function(req, res){
  db.one("SELECT * FROM users WHERE id = " + id)
  .then(function(data){
    var one_user = {
      email: data.email
  };
   res.render('user/index', one_user);
  });
});

//ASKS FOR REQUIRED INFO IN ORDER TO SIGN UP
//CREATES NEW USER IN DATABASE
//AND HASHES PASSWORD IN DATABASE
app.post('/signup', function(req, res){
  let data = req.body;
  console.log(data);
  bcrypt
    .hash(data.password, 10, function(err, hash){
      console.log(data.password)
      db.none("INSERT INTO users(email, password_digest) VALUES($1, $2)",[data.email, hash])
      .then(function(){
        res.render("index");
    });
  });
});

//LOGOUT SESSION REDIRECTING TO HOME PAGE
app.get('/logout', function(req, res){
  req.session.user = false;
  res.redirect("/");
});

//--------------------------------------------------------------------

//GET INFO FROM SECOND DATABASE CITIES


//SELECTS LIST OF 10 DESTINATIONS FROM DATABASE "CITIES"
app.get('/places', function(req, res) {
  scdb.any("SELECT * FROM places")
  .then(function(data){
    var all_plans = {
      places: data
    };
    console.log(data)
    res.render('places/index', all_plans)
  });
});

//SELECTS ONE BY ONE IDs OF ELEMENTS TO BE SHOWN FROM DATABASE "CITIES"
app.get('/places/:id', function(req, res){
  var id = req.params.id;
  scdb.one("SELECT * FROM places WHERE id = " + id).then(function(data){
    var one_place = {
      name: data.name,
      img_url: data.img_url,
      comment: data.comment
  };
   res.render('places/show', one_place)
  });
});

//----------------------------------------------------------
//CREATES GOOGLE MAP ROUTE THROUGH A LINK ON MAIN USER'S PAGE
app.get('/map',function(req, res){
res.render('map/index');
})

//----------------------------------------------
//ROUTE TO FORM ATTACHED TO LINK ON USER'S LOGGED IN PAGE
//THAT ALLOWS USERS POSTING NEW TRAVEL EXPERIENCES
app.get('/posts', function(req, res) {
  db.any("SELECT * FROM posts")
  .then(function(data){
    var all_trips = {
      trips: data
    };
    res.render('posts/index', all_trips);
  });
});

//ACTUAL POST ROUTE THAT RETRIEVES POSTS INFO AND SAVES
//THEM IN DATABASE.
/*
app.post("/posts", function(req, res){
country = req.body.country;
url_image = req.body.url_image;
comment = req.body.comment;
if(country===""||url_image===""||comment===""){
    res.render("error/show");
}else{
db.one("insert into posts(country, url_image, comment)VALUES($1,$2,$3) returning id",[country,url_image,comment])
.then(data=>{
res.redirect('/posts/'+data.id);
});
}
});*/
//------------------------------------------------------
//UPDATE EMAIL
app.put('/user', function(req, res){
    db.none("UPDATE users SET email = $1 WHERE email = $2",
      [req.body.email, req.session.user.email]
    ).catch(function(){
      res.send('Failed to update user.');
    }).then(function(){
      res.send('User updated.');
    });

});
/*
//UPDATE PASSWORD
app.post('/user', function(req, res){
  let pass = req.body.password;
  console.log(pass);
  bcrypt
    .hash(pass, 10, function(err, hash){
      console.log(pass)
      db.none("INSERT INTO users(email, password_digest) VALUES($1, $2)",[data.email, hash])
      .then(function(){
        res.send("updated");
    });
  });
});
*/
//ROUTE THAT SENDS ALL POSTS TO COMMENTS INDEX FILE
app.get('/comments', function(req, res){
    db.any("SELECT * FROM posts")
  .then(function(data){
    let all_posts = {
      posts:data
    };
    res.render('comments/index', all_posts);
  });
});

app.get('/posts/:id', function(req, res){
  var id = req.params.id;
  db.one("SELECT * FROM posts WHERE id = " + id)
  .then(function(data){
    var one_post = {
      country: data.country,
      url_image: data.url_image,
      comment: data.comment
    };
    res.render('comments/show', one_post)
  });
});

//-----------------------------------------------------------


app.get('/myposts', function(req, res){
  var data;
  if(req.session.user){
       data = {
      "logged_in": true,
      "email": req.session.user.email,
      //"nickname": req.session.user.nickname
      };

     var user_id = req.session.user.id;
    db.any("SELECT * FROM posts WHERE user_id = $1", user_id)
       .then(function(info){
         console.log(info);
          user_posts = {
           myPosts: info,
           security: data
          }

        res.render('user/index', user_posts)
     })

  } else {
    res.render('user/index');
  }
})




//DELETE USER PROFILE
app.delete ('/user', function(req, res){
  console.log(req.session.user.email)
  db.none("DELETE FROM users WHERE email = $1", req.session.user.email)
  .then(function(){
    res.send('user deleted')
  })

 });

//Multer upload

app.post('/posts', upload.single('upl'), function(req,res){
 var country = req.body.country;
 var file =req.file.path.substring(6);
 var comment=req.body.comment;
  db.one("INSERT INTO posts (country, url_image, comment) VALUES ($1, $2, $3) returning id",
      [country, file, comment]
      ).then(function(data){
    res.redirect('posts/'+data.id);
    });

});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Server Running {^-^}");
});
