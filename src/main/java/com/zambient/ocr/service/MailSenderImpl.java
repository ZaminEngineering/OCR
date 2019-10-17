package com.zambient.ocr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import com.zambient.ocr.exceptions.MailException;
import com.zambient.ocr.model.MailReceiver;

@Service
public class MailSenderImpl implements MailSender{
	
	@Autowired
	private JavaMailSenderImpl javaMailSender;
	
	@Autowired
	private SimpleMailMessage simpleMailMessage;
	
	public String mailSenderService(MailReceiver mailReceiver){
		
		try{
			 System.out.println("mail to :"+mailReceiver.getMailTo());
			simpleMailMessage.setTo(mailReceiver.getMailTo());
			simpleMailMessage.setSubject(mailReceiver.getSubject());
			simpleMailMessage.setText(mailReceiver.getBody());
			javaMailSender.send(simpleMailMessage);
			
			
		}catch(Exception exc){
			System.out.println("Mail exception");
			exc.printStackTrace();
			new MailException(exc);
		}
		
		
		return "Message Delivered";
	}

}
