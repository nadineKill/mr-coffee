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

	@Column(name="YEAR")
	private Integer year;

	@Column(name="MONTH")
	private Integer month;

	@Column(name="NR_OF_PADS")
	private Integer nrOfPads;

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
	public Integer getYear() {
		return this.year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public Integer getMonth() {
		return this.month;
	}

	public void setMonth(Integer month) {
		this.month = month;
	}

	public Integer getnrOfPads() {
		return this.nrOfPads;
	}

	public void setnrOfPads(Integer nrOfPads) {
		this.nrOfPads = nrOfPads;
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