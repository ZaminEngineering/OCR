package com.zambient.ocr.model;

import org.springframework.stereotype.Component;

@Component
public class InvoiceData {
	
	private String invoiceDate;
	private String salesValue;
	private String mrpRoundingOff;
	private String retailShopExciseTurnoverTax;
	private String tcs;
	private String retailerCreditBalance;
	public String getInvoiceDate() {
		return invoiceDate;
	}
	public void setInvoiceDate(String invoiceDate) {
		this.invoiceDate = invoiceDate;
	}
	
	public String getSalesValue() {
		return salesValue;
	}
	public void setSalesValue(String salesValue) {
		this.salesValue = salesValue;
	}
	public String getMrpRoundingOff() {
		return mrpRoundingOff;
	}
	public void setMrpRoundingOff(String mrpRoundingOff) {
		this.mrpRoundingOff = mrpRoundingOff;
	}
	public String getRetailShopExciseTurnoverTax() {
		return retailShopExciseTurnoverTax;
	}
	public void setRetailShopExciseTurnoverTax(String retailShopExciseTurnoverTax) {
		this.retailShopExciseTurnoverTax = retailShopExciseTurnoverTax;
	}
	public String getTcs() {
		return tcs;
	}
	public void setTcs(String tcs) {
		this.tcs = tcs;
	}
	public String getRetailerCreditBalance() {
		return retailerCreditBalance;
	}
	public void setRetailerCreditBalance(String retailerCreditBalance) {
		this.retailerCreditBalance = retailerCreditBalance;
	}
	
}
