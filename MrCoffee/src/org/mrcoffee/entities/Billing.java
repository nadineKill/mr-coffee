package org.mrcoffee.entities;

import java.io.Serializable;
import javax.persistence.*;
import java.math.BigDecimal;


/**
 * The persistent class for the BILLING database table.
 *
 */
@Entity
@Table(name="BILLING")
public class Billing implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name="BILLING_ID_GENERATOR", sequenceName="SEQ")
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="BILLING_ID_GENERATOR")
	private long id;

	private BigDecimal credit;

	@Column(name="DELTA_TO_PAY")
	private BigDecimal deltaToPay;

	@Column(name="MONTH")
	private BigDecimal month;

	@Column(name="NR_PADS_WEEK_1")
	private BigDecimal nrPadsWeek1;

	@Column(name="NR_PADS_WEEK_2")
	private BigDecimal nrPadsWeek2;

	@Column(name="NR_PADS_WEEK_3")
	private BigDecimal nrPadsWeek3;

	@Column(name="NR_PADS_WEEK_4")
	private BigDecimal nrPadsWeek4;

	@Column(name="NR_PADS_WEEK_5")
	private BigDecimal nrPadsWeek5;

	private BigDecimal paid;

	@Column(name="SUM_TO_PAY")
	private BigDecimal sumToPay;

	//bi-directional many-to-one association to Consumer
	@ManyToOne
	private Consumer consumer;

	public Billing() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public BigDecimal getCredit() {
		return this.credit;
	}

	public void setCredit(BigDecimal credit) {
		this.credit = credit;
	}

	public BigDecimal getDeltaToPay() {
		return this.deltaToPay;
	}

	public void setDeltaToPay(BigDecimal deltaToPay) {
		this.deltaToPay = deltaToPay;
	}

	public BigDecimal getMonth() {
		return this.month;
	}

	public void setMonth(BigDecimal month) {
		this.month = month;
	}

	public BigDecimal getNrPadsWeek1() {
		return this.nrPadsWeek1;
	}

	public void setNrPadsWeek1(BigDecimal nrPadsWeek1) {
		this.nrPadsWeek1 = nrPadsWeek1;
	}

	public BigDecimal getNrPadsWeek2() {
		return this.nrPadsWeek2;
	}

	public void setNrPadsWeek2(BigDecimal nrPadsWeek2) {
		this.nrPadsWeek2 = nrPadsWeek2;
	}

	public BigDecimal getNrPadsWeek3() {
		return this.nrPadsWeek3;
	}

	public void setNrPadsWeek3(BigDecimal nrPadsWeek3) {
		this.nrPadsWeek3 = nrPadsWeek3;
	}

	public BigDecimal getNrPadsWeek4() {
		return this.nrPadsWeek4;
	}

	public void setNrPadsWeek4(BigDecimal nrPadsWeek4) {
		this.nrPadsWeek4 = nrPadsWeek4;
	}

	public BigDecimal getNrPadsWeek5() {
		return this.nrPadsWeek5;
	}

	public void setNrPadsWeek5(BigDecimal nrPadsWeek5) {
		this.nrPadsWeek5 = nrPadsWeek5;
	}

	public BigDecimal getPaid() {
		return this.paid;
	}

	public void setPaid(BigDecimal paid) {
		this.paid = paid;
	}

	public BigDecimal getSumToPay() {
		return this.sumToPay;
	}

	public void setSumToPay(BigDecimal sumToPay) {
		this.sumToPay = sumToPay;
	}

	public Consumer getConsumer() {
		return this.consumer;
	}

	public void setConsumer(Consumer consumer) {
		this.consumer = consumer;
	}

}