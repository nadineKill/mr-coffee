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
@XmlRootElement(name=Consumer.TYPE_NAME)
public class Consumer implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final String TYPE_NAME = "consumer";
	public static final String PROPERTY_ID = "id";
	public static final String PROPERTY_FORENAME = "forename";
	public static final String PROPERTY_SURNAME = "surname";


	@Id
	@SequenceGenerator(name="CONSUMER_ID_GENERATOR", sequenceName="SEQ")
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="CONSUMER_ID_GENERATOR")
	private long id;

	private String forename;

	private String surname;

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

	public List<Billing> getBillings() {
		return this.billings;
	}

	public void setBillings(List<Billing> billings) {
		this.billings = billings;
	}

}