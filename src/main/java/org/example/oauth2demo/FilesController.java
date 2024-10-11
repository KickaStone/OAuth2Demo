package org.example.oauth2demo;

import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FilesController {

    boolean isAuthenticated = false;
    
    @GetMapping("/files")
    public String files(Model model) {
        model.addAttribute("isAuthenticated", isAuthenticated);
        return "files";
    }
}
