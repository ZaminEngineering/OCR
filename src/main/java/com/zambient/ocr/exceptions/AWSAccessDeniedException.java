package com.zambient.ocr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


public class AWSAccessDeniedException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	
	public String message;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	
	 public AWSAccessDeniedException(Throwable cause) {
	        super(cause);
	    }

	    public AWSAccessDeniedException(String message, Throwable cause) {
	        super(message, cause);
	    }
	

}
