package org.example.oauth2demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FilesController {

    @GetMapping("/files")
    public String files() {
        return "files";
    }
}
