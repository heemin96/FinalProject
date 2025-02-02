package data.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import data.dto.CityDto;
import data.dto.TripDto;
import data.mapper.MainPageMapper;
import data.service.MainPageService;



@RestController
@CrossOrigin
public class Maincontroller {
	
	@Autowired
	private MainPageService service;
	
	@Autowired
	MainPageMapper mapper;
	
	@GetMapping("/cityData")
	public Map<String, Object> cityData() {
	
		      
		List<CityDto> getData2 = service.getData2();
		List<CityDto> getData3 = service.getData3();
		List<CityDto> getData4 = service.getData4();
		
		
		Map<String, Object> map = new HashMap<>();

//		map.put("getData", getData);
		map.put("getData2", getData2);
		map.put("getData3", getData3);
		map.put("getData4", getData4);

		
		return map;
	}
	

	
	@GetMapping("/allUserTrip")
	public int allUserTrip()
	{
		return service.allUserTrip();
	}
	
	@GetMapping("/allUser")
	public int allUser()
	{
		return service.allUser();
	}
	
	@GetMapping("/allReview")
	public int allReview()
	{
		return service.allReview();
	}
	
	
	@GetMapping("/allPlace")
	public int allPlace()
	{
		return service.allPlace();
	}
	
	
}


