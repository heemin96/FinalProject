package data.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import data.dto.MemberSecurityDto;
import data.mapper.MemberMapper;
import data.mapper.MemberSecurityMapper;

@Service
public class CustomMemberDetailsService implements UserDetailsService {
	
	@Autowired
	private MemberSecurityMapper mapper;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Transactional
    public void join(MemberSecurityDto member, String role){
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        member.setAccountNonExpired(true);
        member.setAccountNonLocked(true);
        member.setCredentialsNonExpired(true);
        member.setEnabled(true);
        
        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(role));

        member.setAuthorities(grantedAuthorities);
        member.setType(1);	// 1 : 일반회원
        mapper.saveMember(member);
        
        Map<String, String> map = new HashMap<>();
        map.put("id", member.getId());
        map.put("authority_name", role);
        mapper.saveAuthority(map);
    }
	
	public int checkId(String id) {
		return mapper.checkId(id);
	}
	
	public int checkEmail(String email) {
		return mapper.checkEmail(email);
	}
	
	public void changePassword(String id, String password) {
		Map<String, String> map = new HashMap<>();
		map.put("id", id);
		map.put("password", passwordEncoder.encode(password));
		
		mapper.changePassword(map);
	}
	
	@Override
	public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
		MemberSecurityDto member = mapper.getMemberById(id);
		
		if(member == null)
			throw new UsernameNotFoundException(id);
		
		Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
		grantedAuthorities.add(new SimpleGrantedAuthority(mapper.getMemberAuthorityById(id)));
		member.setAuthorities(grantedAuthorities);
        
        return member;
	}

	public void createMemberKakao(String email, String nickname) {
		// TODO Auto-generated method stub
		Map<String, String> map =new HashMap<>();
		map.put("email", email);
		map.put("nickname", nickname);
		mapper.createMemberKakao(map);
		
				
	}
}
