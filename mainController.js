module.exports= {
    home(request,response){
        response.render('index');
    },
    library(request,response){
        response.render('library');
    },
    login(request,response){
        response.render('login');
    },
    signup(request,response){
        response.render('signup');
    }
};
