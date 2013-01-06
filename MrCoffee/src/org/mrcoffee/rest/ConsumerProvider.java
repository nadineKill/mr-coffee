package org.mrcoffee.rest;

import java.util.List;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.mrcoffee.entities.Consumer;
import org.mrcoffee.service.GenericDataService;

@Stateless
@Path("/consumer")
public class ConsumerProvider {

	@Inject
	private GenericDataService dataService;

	@GET
	@Produces({MediaType.APPLICATION_JSON})//, MediaType.APPLICATION_XML})
	@TransactionAttribute(TransactionAttributeType.NEVER)
	public List<Consumer> getConsumers() {
		return dataService.getEntities(Consumer.class);
	}

}
