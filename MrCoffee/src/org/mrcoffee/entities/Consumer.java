package org.mrcoffee.entities;

import java.io.Serializable;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;


/**
 * The persistent class for the CONSUMER database table.
 *
 */
@Entity
@Table(name="CONSUMER")
@XmlRootElement(name=Consumer.TYPE_NAME)
public class Consumer implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final String TYPE_NAME = "consumer";
	public static final String PROPERTY_ID = "id";
	public static final String PROPERTY_FORENAME = "forename";
	public static final String PROPERTY_SURNAME = "surname";
	public static final String PROPERTY_CREDIT = "credit";

	@Id
	@SequenceGenerator(name="CONSUMER_ID_GENERATOR", sequenceName="SEQ", allocationSize=1)
	@GeneratedValue(strategy=GenerationType.IDENTITY, generator="CONSUMER_ID_GENERATOR")
	private long id;

	@Column(name="FORENAME")
	private String forename;

	@Column(name="SURNAME")
	private String surname;

	@Column(name="CREDIT")
	private Integer credit;

	//bi-directional many-to-one association to Billing
	@OneToMany(mappedBy="consumer")
	@XmlTransient
	@JsonIgnore
	private List<Billing> billings;

	public Consumer() {
	}

	@XmlAttribute(name=PROPERTY_ID)
	@JsonProperty(PROPERTY_ID)
	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@XmlAttribute(name=PROPERTY_FORENAME)
	@JsonProperty(PROPERTY_FORENAME)
	public String getForename() {
		return this.forename;
	}

	public void setForename(String forename) {
		this.forename = forename;
	}

	@XmlAttribute(name=PROPERTY_SURNAME)
	@JsonProperty(PROPERTY_SURNAME)
	public String getSurname() {
		return this.surname;
	}

	public void setSurname(String surename) {
		this.surname = surename;
	}

	@XmlAttribute(name=PROPERTY_CREDIT)
	@JsonProperty(PROPERTY_CREDIT)
	public Integer getCredit() {
		return this.credit;
	}

	public void setCredit(Integer credit) {
		this.credit = credit;
	}

	public List<Billing> getBillings() {
		return this.billings;
	}

	public void setBillings(List<Billing> billings) {
		this.billings = billings;
	}

}