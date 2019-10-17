package com.zambient.ocr.model;

import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@Scope("prototype")
public class Invoice {
	
	private long brandNumber;
	private String brandName;
	private String productType;
	private String packType;
	private String packQty;
	private long caseDeliveredQty;
	private int bottelsDeliveredQty;
	private String unitRate;
	private String billRate;
	private String total;
	public long getBrandNumber() {
		return brandNumber;
	}
	public void setBrandNumber(long brandNumber) {
		this.brandNumber = brandNumber;
	}
	public String getBrandName() {
		return brandName;
	}
	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}
	public String getProductType() {
		return productType;
	}
	public void setProductType(String productType) {
		this.productType = productType;
	}
	public String getPackType() {
		return packType;
	}
	public void setPackType(String packType) {
		this.packType = packType;
	}
	public String getPackQty() {
		return packQty;
	}
	public void setPackQty(String packQty) {
		this.packQty = packQty;
	}
	public long getCaseDeliveredQty() {
		return caseDeliveredQty;
	}
	public void setCaseDeliveredQty(long caseDeliveredQty) {
		this.caseDeliveredQty = caseDeliveredQty;
	}
	public int getBottelsDeliveredQty() {
		return bottelsDeliveredQty;
	}
	public void setBottelsDeliveredQty(int bottelsDeliveredQty) {
		this.bottelsDeliveredQty = bottelsDeliveredQty;
	}
	public String getUnitRate() {
		return unitRate;
	}
	public void setUnitRate(String unitRate) {
		this.unitRate = unitRate;
	}
	public String getBillRate() {
		return billRate;
	}
	public void setBillRate(String billRate) {
		this.billRate = billRate;
	}
	public String getTotal() {
		return total;
	}
	public void setTotal(String total) {
		this.total = total;
	}
	@Override
	public String toString() {
		return "Invoice [brandNumber=" + brandNumber + ", brandName=" + brandName + ", productType=" + productType
				+ ", packType=" + packType + ", packQty=" + packQty + ", caseDeliveredQty=" + caseDeliveredQty
				+ ", bottelsDeliveredQty=" + bottelsDeliveredQty + ", unitRate=" + unitRate + ", billRate=" + billRate
				+ ", total=" + total + "]";
	}
	

}
