console.log('state: ' + history.state)
window.history.back();
// function url_domain(data) 
// {
//     if (data)
//     {
//         var a = document.createElement('a');
//         a.href = data;
//         return a.hostname;
//     }
//     else
//     {
//         return null;
//     }
// }

// ldomain = url_domain(window.location.href);

// console.log(window.history);
// console.log(ldomain);

// lnewDomain = url_domain(window.location.href);

// ix = 5;
// while ((ldomain == lnewDomain) && ix)
// {
//     console.log(window.history.length)
//     window.history.go(-1);
//     console.log(2);
//     console.log(window.location.href);
//     lnewDomain = url_domain(window.location.href);
//     console.log(3);
//     console.log(lnewDomain);
//     ix --;
// }