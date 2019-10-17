package com.zambient.ocr.controller;

import org.hibernate.resource.transaction.spi.TransactionStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.zambient.ocr.dao.UserDao;
import com.zambient.ocr.entity.Users;


@Controller
public class UserController {
	
	@Autowired
	private UserDao userDao;
	
	@RequestMapping(value="/registration",method=RequestMethod.POST)
	public ResponseEntity<Integer> userRegistration(@RequestBody Users users){
		
		Integer status=userDao.userRegistration(users);
		System.out.print("Satatus :"+status);
		if(status==0){
			return new ResponseEntity<Integer>(status,HttpStatus.BAD_REQUEST);
		}else{
		return new ResponseEntity<Integer>(status,HttpStatus.CREATED);
		}
	}

}
