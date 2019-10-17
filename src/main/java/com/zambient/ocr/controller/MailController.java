package com.zambient.ocr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.zambient.ocr.model.MailReceiver;
import com.zambient.ocr.service.MailSender;
import com.zambient.ocr.service.MailSenderImpl;

/**
 * @author Durga Rao Maruboina
 * @version 1.0
 * @since 2019
 * <h3>MailController class contils all mailing services</h3>
 * This mail Services are created to handle the business flow 
 * 
 * 
 */

@Controller
public class MailController {
	
	
	@Autowired
	private MailSender mailSender;
	
	/**
	 * This service is used to send the simple mail
	 *@param host
	 *@param port
	 *@param smtp
	 *@param imap
	 *@param from
	 *@param to
	 */

	@RequestMapping(value="/mailSender" ,method=RequestMethod.POST)
	public ResponseEntity<Object> mailSenderAPI(@RequestBody MailReceiver mailReceiver){
		String response=null;
		  try{
			  response=mailSender.mailSenderService(mailReceiver);	
			  System.out.println("response : "+response);
		  }catch(Exception exc){
			  exc.printStackTrace();
		  }
		
		return new ResponseEntity<Object>(response,HttpStatus.OK);
	}
	
}
