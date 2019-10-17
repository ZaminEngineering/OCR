package com.zambient.ocr.exceptions;

import org.hibernate.resource.transaction.spi.TransactionStatus;

public class DatabaseException extends RuntimeException{
	
	private String status;
	
	public DatabaseException(){
		super();
	}

	public DatabaseException(String status){
		this.status=status;
	}
}
