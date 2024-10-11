package org.example.oauth2demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import java.util.Map;
@Controller
public class OAuthController {

    boolean isAuthenticated = false;
    String accessToken = null;

    @RequestMapping("/oauth")
    public ModelAndView oauth(Map<String, Object> model) {
        model.put("isAuthenticated", isAuthenticated);
        model.put("accessToken", accessToken);
        return new ModelAndView("oauth");
    }
}
