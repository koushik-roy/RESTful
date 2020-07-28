var express= require("express"),
	methodOverride=require("method-override"),
	expressSanitizer= require("express-sanitizer"),
	app=express(),
	bodyParser= require("body-parser"),
	mongoose=require("mongoose");


mongoose.connect("mongodb://localhost:27017/blogApp",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});


var Blog= mongoose.model("Blog", blogSchema);


app.get("/",function(req,res){
	res.redirect("/blogs");
});

// new route
app.get("/blogs/new",function(req,res){
	res.render("new");
});

// index route
app.get("/blogs", function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("err");
		}else{
			res.render("index",{blogs: blogs});
		}
    });
});


// create route
app.post("/blogs", function(req,res){
		//create blog
	req.body.blog.body=req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog, function(err,newBlog){
		if(err){
			res.render("new");
		}else{
			//redirect to index
			res.redirect("/blogs");
		}
	});
});

//show route
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});
		}
	});
});

// edit route
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundBlog});
		}
	});
});

// update route
app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			console.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

// delete route
app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
			if(err){
				res.send("REQUEST FAILED");
			}else{
				res.redirect("/blogs");
			}
	});
});

	app.listen(5000,function(){
		console.log("running");
	});






















