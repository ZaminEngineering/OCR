package com.zambient.ocr.exceptions;

import java.io.Serializable;
import java.util.List;

import org.springframework.stereotype.Component;


public class ErrorResponse implements Serializable{
	 private static final long serialVersionUID = 1L;
	
	private String message;
	private List<String> details;
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public List<String> getDetails() {
		return details;
	}
	public void setDetails(List<String> details) {
		this.details = details;
	}

}
