package data.dto;

import java.sql.Timestamp;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Alias("member")
@Data
public class MemberDto {
	private int num;
	private String name;
	private String id;
	private String password;
	private String type;
	private String email;
	private String tel;
	private String birthday;
	private String zonecode;
	private String address1;
	private String address2;
	@JsonFormat(pattern = "yyyy-MM-dd")
	private Timestamp registered_at;
	
	private String profile;
}
