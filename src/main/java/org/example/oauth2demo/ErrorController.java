package org.example.oauth2demo;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class ErrorController {

    // /error?error=error_message
    @GetMapping("/error")
    public String error(Model model, HttpServletRequest request) {
        String errorMessage = request.getParameter("error");
        model.addAttribute("error", errorMessage);
        return "error";
    }
}
