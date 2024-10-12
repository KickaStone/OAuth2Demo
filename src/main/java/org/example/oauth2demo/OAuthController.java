package org.example.oauth2demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class OAuthController {

    boolean hasCode = false;
    boolean hasToken = false;
    String accessToken = null;
    String refreshToken = null;
    String code = null;
    @RequestMapping("/oauth/callback")
    public String callback(HttpServletRequest request) {
        // get accessToken
        code = request.getParameter("code");
        if (code != null) {
            hasCode = true;
        } 
        return "redirect:/oauth";
    }

    @RequestMapping("/oauth")
    public ModelAndView oauth(Map<String, Object> model) {
        model.put("hasCode", hasCode);
        model.put("hasToken", hasToken);
        model.put("accessToken", accessToken);
        model.put("refreshToken", refreshToken);
        model.put("code", code);
        return new ModelAndView("oauth");
    }
}
