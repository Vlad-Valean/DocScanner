//namespace DocScanner.Services
//{
//    using CoreAdmin;
//    using Microsoft.AspNetCore.Http;
//    public class MyAdminAuthProvider : ICoreAdminAuthProvider
//    {
//        public bool IsCurrentUserAdmin(HttpContext context)
//        {
//            var user = context.User;
//            return user.Identity?.IsAuthenticated == true &&
//                   user.IsInRole("Admin"); // Or check claims like: user.HasClaim("isAdmin", "true")
//        }
//    }
//}