package com.zambient.ocr.exceptions;

public class MailException extends RuntimeException{
	
	private String message;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	public MailException(){
		super();
	}
	
	public MailException(Exception exc){
		
	}

}
